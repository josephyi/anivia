defmodule Mix.Tasks.Anivia.StaticContent do
  use Mix.Task
  @moduledoc false

  def run(_) do
    Mix.Task.run "app.start", []
    version = Viktor.Operation.StaticData.version("na") |> Enum.at(0)

    champs_response = Viktor.static_data_champion("na", [dataById: true, champData: "image"])
    champs = champs_response["data"]
    keys = Map.keys(champs)

    sprite_to_champ_ids = Enum.reduce(keys, %{}, fn(x, acc) ->
      Map.merge(acc, %{(champs[x] |> Map.fetch!("image")) |> Map.fetch!("sprite") => x}, fn _k, v1, v2 ->
            [v1, v2] |> List.flatten end) end)

    {:ok, file} = File.open("web/static/js/containers/StaticChampionSprites.css", [:write, :utf8])
    Enum.each(sprite_to_champ_ids, fn({sprite_key, v}) ->
      classes = Enum.map(v, &(".champion-#{&1}")) |> Enum.join(", ")
      IO.write(file, classes <> " { background: url(http://ddragon.leagueoflegends.com/cdn/#{version}/img/sprite/#{sprite_key}) 0px 0; height: 48px; width: 48px; display:block; } \n")

      Enum.each(v, fn id ->
        x_pos = get_in(champs, [id, "image", "x"])
        y_pos = get_in(champs, [id, "image", "y"])
        IO.write(file, ".champion-#{id} { background-position: -#{x_pos}px -#{y_pos}px; } ")
      end)

      IO.write(file, "\n")
    end)
    File.close(file)

    champ_id_json = champs |> Enum.map(fn {k, v} -> {k, Map.drop(v, ["id", "image", "title"])["name"]} end) |> Map.new |> Poison.encode!
    File.write!("web/static/js/data/champ_id_to_name.json", champ_id_json)
  end
end