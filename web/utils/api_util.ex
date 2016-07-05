defmodule Anivia.ApiUtil do
  def ranked_leagues(region, summoners) do
    summoners
    |> Map.values
    |> Enum.map(&(&1["id"]))
    |> Enum.chunk(10, 10, [])
    |> Enum.map(&(Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, Enum.join(&1, ",")).body end)))
    |> Enum.map(&(Task.await(&1)))
    |> Enum.reduce(%{}, &(Map.merge(&2, &1)))
  end

  def summoners_in_games(region, games) do
    get_in(Map.values(games), [Access.all, "participants"])
    |> List.flatten
    |> Enum.map(&(canonicalize(&1["summonerName"])))
    |> Enum.chunk(40, 40, [])
    |> Enum.map(&(Task.async(fn -> Viktor.Operation.Summoner.by_name(region, Enum.join(&1, ",")).body end)))
    |> Enum.map(&(Task.await(&1)))
    |> Enum.reduce(%{}, &(Map.merge(&2, &1)))
  end

  def recent_games_data(region, summoner_id) do
    recent_games_response = Viktor.recent_games(region, summoner_id)
    case recent_games_response.status_code do
      200 ->
        %{"recentGamesData" => %{ summoner_id => recent_games_response.body["games"] }}
      _ ->
        %{"recentGamesData" => %{ summoner_id => [] }}
    end
  end

  def normalize_game(game) do
    %{Integer.to_string(game["gameId"]) => game}
  end

  def canonicalize(name) do
    name |> String.downcase |> String.replace(" ", "")
  end

  def wrap_response(response, region) do
    %{region => response}
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

  def ranked_response(region, summoner_id) do
    ranked_stats_response = Viktor.ranked_stats(region, summoner_id)

    case ranked_stats_response.status_code do
      200 ->
        { summoner_ranked_stats, champion_ranked_stats } = ranked_stats_response.body["champions"]
        |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]})
        |> Map.pop("0")

        champion_stats = Enum.map(champion_ranked_stats, fn {k, v} -> Map.put(v, "id", k) end) |> Enum.sort(&(&1["totalSessionsPlayed"] > &2["totalSessionsPlayed"]))
        %{
          "aggregateRankedStatsData" => %{ summoner_id => summoner_ranked_stats },
          "rankedStatsData" => %{ summoner_id => champion_stats }
        }
      _ ->
        %{
          "aggregateRankedStatsData" => %{ summoner_id => %{} },
          "rankedStatsData" => %{ summoner_id => [] }
        }
    end
  end

  def current_game_response(region, summoner_id) when is_integer(summoner_id) do
    current_game_response(region, Integer.to_string(summoner_id))
  end

  def current_game_response(region, summoner_id) when is_binary(summoner_id) do
    current_game_response = Viktor.current_game(region, summoner_id)
    case current_game_response.status_code do
      200 ->
        current_game = current_game_response.body
        ids = Enum.map(current_game["participants"], &(&1["summonerId"]))
        %{
          "currentGamesMap" => Map.new(ids, &{Integer.to_string(&1), current_game["gameId"]}),
          "currentGames" => %{Integer.to_string(current_game["gameId"]) => current_game}
        }
      _ ->
        %{
          "currentGamesMap" => %{summoner_id => -1},
          "currentGames" => %{}
        }
    end
  end

  def summoner_profile(region, summoner) do
    current_game_response = Viktor.current_game(region, summoner["id"])
    ranked_data_task = Task.async(fn -> ranked_data(region, summoner) end)
    recent_games_task = Task.async(fn -> recent_games_data(region, Integer.to_string(summoner["id"])) end)

    case current_game_response.status_code do
      200 ->
        current_game = current_game_response.body
        names = Enum.map(current_game["participants"], &(canonicalize(&1["summonerName"]))) |> Enum.join(",")
        ids = Enum.map(current_game["participants"], &(&1["summonerId"]))
        league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, ids |> Enum.join(",")).body end)
        %{
          "summoners" => Viktor.Operation.Summoner.by_name(region, names).body,
          "currentGamesMap" => Map.new(ids, &{Integer.to_string(&1), current_game["gameId"]}),
          "currentGames" => %{Integer.to_string(current_game["gameId"]) => current_game},
          "rankedLeagues" => Task.await(league_entry_task)
        } |> Map.merge(Task.await(ranked_data_task)) |> Map.merge(Task.await(recent_games_task))
      _ ->
        league_entry_task = Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, summoner["id"]).body end)

        %{
          "summoners" => %{canonicalize(summoner["name"]) => summoner},
          "currentGamesMap" => %{Integer.to_string(summoner["id"]) => -1},
          "currentGames" => %{},
          "rankedLeagues" => Task.await(league_entry_task)
        } |> Map.merge(Task.await(ranked_data_task)) |> Map.merge(Task.await(recent_games_task))
    end
  end
end