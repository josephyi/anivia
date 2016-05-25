defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  @static_champ File.read!("data/champ_images.json") |> Poison.decode!

  def summoner_detail(conn, %{"region" => region, "summoner_id" => summoner_id}) do
      current_game_task = Task.async(fn -> Viktor.current_game(region, summoner_id)  end)
      ranked_stats_task = Task.async(fn -> Viktor.ranked_stats(region, summoner_id)["champions"] end)
      recent_games_task = Task.async(fn -> Viktor.recent_games(region, summoner_id) end)

      {summoner_ranked_stats, champion_ranked_stats} = Task.await(ranked_stats_task) |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]}) |> Map.pop("0")
      rankedStats = Map.keys(champion_ranked_stats) |> Enum.map(&(Map.merge(champion_ranked_stats[&1], @static_champ[&1])))

      result = Map.new
      |> Map.put("rankedStats", rankedStats)
      |> Map.put("recentGames", Task.await(recent_games_task))

      json conn, result
  end

  def summoner(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      summoner = Viktor.Operation.Summoner.by_name(region, summoner_name)[summoner_name]
      result = Map.new |> Map.put("summoner", summoner)
      json conn, result
  end
end