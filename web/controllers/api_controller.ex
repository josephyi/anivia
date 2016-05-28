defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  @moduledoc false

  @static_champ File.read!("data/champ_images.json") |> Poison.decode!

  def summoner(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      canonical_name = canonicalize(summoner_name)

      response = Viktor.Operation.Summoner.by_name(region, canonical_name)
      case response do
         %{"status" => %{"status_code" => _}} ->
           conn
           |> put_status(response["status"] |> Map.fetch!("status_code"))
           |> render(Anivia.ErrorView, "errors.json", response: response)
         _ ->
           summoner = response[canonical_name]

           current_game_task = Task.async(fn -> Viktor.current_game(region, summoner["id"])  end)
           ranked_stats_task = Task.async(fn -> Viktor.ranked_stats(region, summoner["id"])["champions"] end)
           recent_games_task = Task.async(fn -> Viktor.recent_games(region, summoner["id"]) end)

          {summoner_ranked_stats, champion_ranked_stats} = Task.await(ranked_stats_task)
          |> Map.new(&{Integer.to_string(&1["id"]), &1["stats"]})
          |> Map.pop("0")

          rankedStats = Map.keys(champion_ranked_stats) |> Enum.map(&(Map.merge(champion_ranked_stats[&1], @static_champ[&1])))
          recentGames = Task.await(recent_games_task)["games"]

          result =  %{ region => %{ canonical_name => %{ "summoner" => response[canonical_name] , "rankedStats" => rankedStats } } }


      json conn, result
  end


  end

  def canonicalize(name) do
    name |> String.downcase |> String.replace(" ", "")
  end
end