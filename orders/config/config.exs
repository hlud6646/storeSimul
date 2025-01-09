import Config

config :orders, Orders.Repo,
  database: "storesimul",
  username: "storesimuladmin",
  # password: "",
  hostname: "localhost",
  port: 5432

config :orders, ecto_repos: [Orders.Repo]
