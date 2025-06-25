import Config

config :orders, Orders.Repo,
  database: System.get_env("POSTGRES_NAME", "storesimul"),
  username: System.get_env("POSTGRES_USERNAME", "storesimul"),
  password: System.get_env("POSTGRES_PASSWORD", "secret"),
  hostname: System.get_env("POSTGRES_HOSTNAME", "store-db"),
  port: String.to_integer(System.get_env("POSTGRES_PORT", "5432"))

config :orders, ecto_repos: [Orders.Repo]
