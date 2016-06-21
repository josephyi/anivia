defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  def featured_games(conn, %{"region" => region}) do
    response = Viktor.featured_games(region)
    json conn, %{ "featuredGames" => response } |> wrap_response(region)
  end

  def summoner(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      canonical_name = canonicalize(summoner_name)

      response = Viktor.Operation.Summoner.by_name(region, canonical_name)
      case response do
         %{"status" => %{"status_code" => _}} ->
           conn
           |> put_status(response["status"] |> Map.fetch!("status_code"))
           |> render(Anivia.ErrorView, "errors.json", response: response)
         %{^canonical_name => summoner_response} ->
           json conn, summoner_profile(region, summoner_response) |> wrap_response(region)
      end
  end

  def sync_recent_games_and_ranked_stats(conn, %{"region" => region, "summoner_id" => summoner_id}) do
    ranked_stats_task = Task.async(fn -> ranked_response(region, summoner_id) end)
    recent_games_task = Task.async(fn -> recent_games_data(region, summoner_id) end)
    json conn, Map.merge(Task.await(ranked_stats_task), Task.await(recent_games_task)) |> wrap_response(region)
  end


  def summoner_profile(region, summoner) do
    current_game = Viktor.current_game(region, summoner["id"])
    ranked_data_task = Task.async(fn -> ranked_data(region, summoner) end)
    recent_games_task = Task.async(fn -> recent_games_data(region, Integer.to_string(summoner["id"])) end)

    case current_game do
      %{"status" => %{"status_code" => 404}} ->
        league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, summoner["id"]) end)

        %{
          "summoners" => %{canonicalize(summoner["name"]) => summoner},
          "currentGamesMap" => %{Integer.to_string(summoner["id"]) => -1},
          "currentGames" => %{},
          "rankedLeagues" => Task.await(league_entry_task)
        } |> Map.merge(Task.await(ranked_data_task)) |> Map.merge(Task.await(recent_games_task))
      _ ->
        names = Enum.map(current_game["participants"], &(canonicalize(&1["summonerName"]))) |> Enum.join(",")
        ids = Enum.map(current_game["participants"], &(&1["summonerId"]))
        league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, ids |> Enum.join(",")) end)
        %{
          "summoners" => Viktor.Operation.Summoner.by_name(region, names),
          "currentGamesMap" => Map.new(ids, &{Integer.to_string(&1), current_game["gameId"]}),
          "currentGames" => %{Integer.to_string(current_game["gameId"]) => current_game},
          "rankedLeagues" => Task.await(league_entry_task)
        } |> Map.merge(Task.await(ranked_data_task)) |> Map.merge(Task.await(recent_games_task))
    end
  end

  def wrap_response(response, region) do
    %{region => response}
  end

  def canonicalize(name) do
    name |> String.downcase |> String.replace(" ", "")
  end

  def ranked_data(region, summoner) do
    if summoner["summonerLevel"] == 30 do
      ranked_response(region, Integer.to_string(summoner["id"]))
    else
      %{
        "aggregateRankedStatsData" => %{ Integer.to_string(summoner["id"]) => %{}},
        "rankedStatsData" => %{ Integer.to_string(summoner["id"]) => []}
      }
    end
  end

  def recent_games_data(region, summoner_id) do
    %{"recentGamesData" => %{ summoner_id => Viktor.recent_games(region, summoner_id)["games"] }}
  end

  def ranked_response(region, summoner_id) do
    { summoner_ranked_stats, champion_ranked_stats } = Viktor.ranked_stats(region, summoner_id)["champions"]
            |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]})
            |> Map.pop("0")

    champion_stats = Enum.map(champion_ranked_stats, fn {k, v} -> Map.put(v, "id", k) end) |> Enum.sort(&(&1["totalSessionsPlayed"] > &2["totalSessionsPlayed"]))

    %{
      "aggregateRankedStatsData" => %{ summoner_id => summoner_ranked_stats },
      "rankedStatsData" => %{ summoner_id => champion_stats }
    }
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