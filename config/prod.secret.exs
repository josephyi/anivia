use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :anivia, Anivia.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

# Configure your database
#config :anivia, Anivia.Repo,
#  adapter: Ecto.Adapters.Postgres,
#  username: "postgres",
#  password: "postgres",
#  database: "anivia_prod",
#  pool_size: 20
