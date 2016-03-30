ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Anivia.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Anivia.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Anivia.Repo)

