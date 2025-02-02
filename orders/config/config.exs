import Config

config :orders, Orders.Repo,
  database: System.get_env("DB_NAME", "storesimul"),
  username: System.get_env("DB_USERNAME", "storesimul"),
  password: System.get_env("DB_PASSWORD", "secret"),
  hostname: System.get_env("DB_HOSTNAME", "store-db"),
  port: String.to_integer(System.get_env("DB_PORT", "5432"))

config :orders, ecto_repos: [Orders.Repo]
