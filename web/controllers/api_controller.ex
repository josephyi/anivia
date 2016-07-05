defmodule Anivia.ApiController do
  use Anivia.Web, :controller
  import Anivia.ApiUtil

  @moduledoc false

  def featured_games(conn, %{"region" => region}) do
    cache_key = "#{region}-featured_games"
    cached_response = ConCache.get(:response_cache, cache_key)

    if cached_response do
      json conn, cached_response
    else
      featured_games_response = Viktor.featured_games(region)

      case featured_games_response.status_code do
        200 ->
          current_games = featured_games_response.body["gameList"]
          |> Enum.reduce(%{}, &(Map.put(&2, Integer.to_string(&1["gameId"]), &1)))

          summoners = summoners_in_games(region, current_games)
          rankedLeagues = ranked_leagues(region, summoners)

          response = %{
            "summoners" => summoners,
            "featuredGames" => featured_games_response.body,
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
        _ ->
          conn
          |> put_status(featured_games_response.status_code)
          |> render(Anivia.ErrorView, "errors.json", response: featured_games_response.body)
      end
    end
  end

  def summoner(conn, %{"region" => region, "summoner_name" => summoner_name}) do
      canonical_name = canonicalize(summoner_name)

      response = Viktor.summoner_by_name(region, canonical_name)
      case response.status_code do
         200 ->
           json conn, summoner_profile(region, response.body[canonical_name]) |> wrap_response(region)
         _ ->
           conn
           |> put_status(response.status_code)
           |> render(Anivia.ErrorView, "errors.json", response: response.body)
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
end