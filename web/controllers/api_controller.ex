defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  def summoner_page(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      summoner = Viktor.Operation.Summoner.by_name(region, summoner_name)[summoner_name]
      rankedStats = Viktor.ranked_stats(region, summoner["id"])["champions"]

      result = Map.new
      |> Map.put("summoner", summoner)
      |> Map.put("rankedStats", rankedStats)

      json conn, result
  end
end