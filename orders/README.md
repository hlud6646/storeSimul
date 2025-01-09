# Orders

[erg@ergpad orders]$ mix ecto.gen.repo -r Orders.Repo
* creating lib/orders
* creating lib/orders/repo.ex
* creating config/config.exs
Don't forget to add your new repo to your supervision tree
(typically in lib/orders/application.ex):

    def start(_type, _args) do
      children = [
        Orders.Repo,
      ]

And to add it to the list of Ecto repositories in your
configuration files (so Ecto tasks work as expected):

    config :orders,
      ecto_repos: [Orders.Repo]