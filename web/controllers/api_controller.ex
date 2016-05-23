defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  @static_champ File.read!("data/champ_images.json") |> Poison.decode!

  def summoner_page(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      summoner = Viktor.Operation.Summoner.by_name(region, summoner_name)[summoner_name]

      {summoner_ranked_stats, champion_ranked_stats} = Viktor.ranked_stats(region, summoner["id"])["champions"]
      |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]}) |> Map.pop("0")

      rankedStats = Map.keys(champion_ranked_stats) |> Enum.map(&(Map.merge(champion_ranked_stats[&1], @static_champ[&1])))

      result = Map.new
      |> Map.put("summoner", Map.merge(summoner, summoner_ranked_stats))
      |> Map.put("rankedStats", rankedStats)

      json conn, result
  end
end