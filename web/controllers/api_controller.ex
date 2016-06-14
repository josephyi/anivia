defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  @current_game_test File.read!("web/current_game_test.json") |> Poison.decode!

  def summoner(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      canonical_name = canonicalize(summoner_name)

      response = Viktor.Operation.Summoner.by_name(region, canonical_name)
      case response do
         %{"status" => %{"status_code" => _}} ->
           conn
           |> put_status(response["status"] |> Map.fetch!("status_code"))
           |> render(Anivia.ErrorView, "errors.json", response: response)
         %{^canonical_name => summoner_response} ->
           current_game = @current_game_test #Task.async(fn -> Viktor.current_game(region, summoner_response["id"]) end)
           names = Enum.map(current_game["participants"], &(canonicalize(&1["summonerName"]))) |> Enum.join(",")
           ids = Enum.map(current_game["participants"], &(&1["summonerId"])) |> Enum.join(",")
           summoners = Viktor.Operation.Summoner.by_name("na", names) |> Map.put(canonical_name, summoner_response)

           league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, ids) end)
           #result = %{ "summoner" => summoner_response}
           #|> add_game_data(region, summoner_response)
           #|> add_ranked_data(region, summoner_response)

           #json conn, %{ region => %{canonical_name => result} }
           json conn, %{ region => %{ "summoners" => summoners, "currentGame" => current_game, "rankedLeagues" => Task.await(league_entry_task) } }
      end
  end

  def canonicalize(name) do
    name |> String.downcase |> String.replace(" ", "")
  end

  def add_game_data(map, region, summoner) do
    recent_games_task = Task.async(fn -> Viktor.recent_games(region, summoner["id"]) end)

    map
    |> Map.put("recentGames", api_task_handler(recent_games_task, "games"))
    |> Map.put("currentGame", @current_game_test)  #api_task_handler(current_game_task, nil))
  end

  def add_ranked_data(map, region, summoner) do
    if summoner["summonerLevel"] == 30 do
      ranked_stats_task = Task.async(fn -> Viktor.ranked_stats(region, summoner["id"]) end)
      league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, summoner["id"]) end)

      { summoner_ranked_stats, champion_ranked_stats } = api_task_handler(ranked_stats_task, "champions")
      |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]})
      |> Map.pop("0")

      map
      |> Map.put("rankedStats", Enum.map(champion_ranked_stats, fn {k, v} -> Map.put(v, "id", k) end) |> Enum.sort(&(&1["totalSessionsPlayed"] > &2["totalSessionsPlayed"])))
      |> Map.put("aggregateRankedStats", summoner_ranked_stats)
      |> Map.put("rankedLeague", api_task_handler(league_entry_task, Integer.to_string(summoner["id"])))
    else
      map |> Map.merge(%{"rankedStats" => [], "aggregateRankedStats" => [], "rankedLeague" => []})
    end
  end

  def api_task_handler(task, key \\ nil) do
    case Task.await(task) do
      %{^key => result} ->
        result
      %{"status" => %{"status_code" => status_code, "message" => message}} ->
        %{"status_code" => status_code, "message" => message}
      response ->
        response
    end
  end
end