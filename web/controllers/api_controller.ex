defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  import Anivia.ApiUtil

  @moduledoc false

  def featured_games(conn, %{"region" => region}) do
    cache_key = "#{region}-featured_games"
    cached_response = ConCache.get(:response_cache, cache_key)

    if false do
      json conn, cached_response
    else
      featured_games_response = Viktor.featured_games(region)

      case featured_games_response do
        %{"status" => %{"status_code" => _}} ->
          conn
          |> put_status(featured_games_response["status"] |> Map.fetch!("status_code"))
          |> render(Anivia.ErrorView, "errors.json", response: featured_games_response)
        %{"gameList" => []} ->
          json conn, []
        _ ->
          current_games = featured_games_response["gameList"]
          |> Enum.reduce(%{}, &(Map.put(&2, Integer.to_string(&1["gameId"]), &1)))

          summoners = Anivia.ApiUtil.summoners_in_games(region, current_games)
          rankedLeagues = Anivia.ApiUtil.ranked_leagues(region, summoners)

          response = %{
            "summoners" => summoners,
            "featuredGames" => featured_games_response,
            "rankedLeagues" => rankedLeagues,
            "currentGame" => %{},
            "currentGamesMap" => %{},
            "aggregateRankedStatsData" => %{},
            "rankedStatsData" => %{},
            "recentGamesData" => %{}
          }
          |> wrap_response(region)

          ConCache.put(:response_cache, cache_key, %ConCache.Item{value: response, ttl: :timer.seconds(300)})
          json conn, response
      end
    end
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

  def games_and_ranked_stats(conn, %{"region" => region, "summoner_id" => summoner_id}) do
    ranked_stats_task = Task.async(fn -> ranked_response(region, summoner_id) end)
    recent_games_task = Task.async(fn -> recent_games_data(region, summoner_id) end)
    current_game_task = Task.async(fn -> current_game_response(region, summoner_id) end)

    response = Map.merge(Task.await(ranked_stats_task), Task.await(recent_games_task))
    |> Map.merge(Task.await(current_game_task))
    |> wrap_response(region)

    json conn, response
  end

  def current_game_response(region, summoner_id) do
    current_game = Viktor.current_game(region, summoner_id)
    case current_game do
      %{"status" => %{"status_code" => 404}} ->
        %{
          "currentGamesMap" => %{Integer.to_string(summoner_id) => -1},
          "currentGames" => %{}
        }
      _ ->
        ids = Enum.map(current_game["participants"], &(&1["summonerId"]))
        %{
          "currentGamesMap" => Map.new(ids, &{Integer.to_string(&1), current_game["gameId"]}),
          "currentGames" => %{Integer.to_string(current_game["gameId"]) => current_game}
        }
    end
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
    ranked_stats_response = Viktor.ranked_stats(region, summoner_id)

    case ranked_stats_response do
          %{"status" => %{"status_code" => 404}} ->
            %{
              "aggregateRankedStatsData" => %{ summoner_id => %{} },
              "rankedStatsData" => %{ summoner_id => [] }
            }
          _ ->
            { summoner_ranked_stats, champion_ranked_stats } = ranked_stats_response["champions"]
                    |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]})
                    |> Map.pop("0")

            champion_stats = Enum.map(champion_ranked_stats, fn {k, v} -> Map.put(v, "id", k) end) |> Enum.sort(&(&1["totalSessionsPlayed"] > &2["totalSessionsPlayed"]))
            %{
            "aggregateRankedStatsData" => %{ summoner_id => summoner_ranked_stats },
            "rankedStatsData" => %{ summoner_id => champion_stats }
            }

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