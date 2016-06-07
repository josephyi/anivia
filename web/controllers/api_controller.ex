defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  def summoner(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      canonical_name = canonicalize(summoner_name)

      response = Viktor.Operation.Summoner.by_name(region, canonical_name)
      case response do
         %{"status" => %{"status_code" => _}} ->
           conn
           |> put_status(response["status"] |> Map.fetch!("status_code"))
           |> render(Anivia.ErrorView, "errors.json", response: response)
         %{^canonical_name => summoner_response} ->
           result = %{ "summoner" => summoner_response}
           |> add_game_data(region, summoner_response)
           |> add_ranked_data(region, summoner_response)

           json conn, %{ region => %{canonical_name => result} }
      end
  end

  def canonicalize(name) do
    name |> String.downcase |> String.replace(" ", "")
  end

  def add_game_data(map, region, summoner) do
    current_game_task = Task.async(fn -> Viktor.current_game(region, summoner["id"]) end)
    recent_games_task = Task.async(fn -> Viktor.recent_games(region, summoner["id"]) end)

    map
    |> Map.put("recentGames", api_task_handler(recent_games_task, "games"))
    |> Map.put("currentGame", api_task_handler(current_game_task, nil))
  end

  def add_ranked_data(map, region, summoner) do
    if summoner["summonerLevel"] == 30 do
      ranked_stats_task = Task.async(fn -> Viktor.ranked_stats(region, summoner["id"]) end)
      league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, summoner["id"]) end)

      {summoner_ranked_stats, champion_ranked_stats} = api_task_handler(ranked_stats_task, "champions")
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

  def api_task_handler(task, key) do
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