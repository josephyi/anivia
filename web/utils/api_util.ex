defmodule Anivia.ApiUtil do
  def ranked_leagues(region, summoners) do
    summoners
    |> Map.values
    |> Enum.map(&(&1["id"]))
    |> Enum.chunk(10)
    |> Enum.map(&(Task.async(fn -> Viktor.Operation.League.by_summoner_entry(region, Enum.join(&1, ",")) end)))
    |> Enum.map(&(Task.await(&1)))
    |> Enum.reduce(%{}, &(Map.merge(&2, &1)))
  end

  def summoners_in_games(region, games) do
    get_in(Map.values(games), [Access.all, "participants"])
    |> List.flatten
    |> Enum.map(&(canonicalize(&1["summonerName"])))
    |> Enum.chunk(40, 40, [])
    |> Enum.map(&(Task.async(fn -> Viktor.Operation.Summoner.by_name(region, Enum.join(&1, ",")) end)))
    |> Enum.map(&(Task.await(&1)))
    |> Enum.at(0)
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
end