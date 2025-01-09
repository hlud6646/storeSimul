defmodule Orders.NewOrder do
  use GenServer
  import Ecto.Query

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], [])
  end

  @impl true
  def init(_) do
    IO.puts("Creating a new order...")

    customer_id = get_random_customer_id()

    order = %Orders.Order{customer: customer_id}
    Orders.Repo.insert(order)

    products = get_random_products(1 + :rand.uniform(30))
    IO.inspect(products)

    # Pick a random n in 1..30,
    # pick n random products, allocate each a random quantity,
    # and add to the order.
    {:ok, nil}
  end

  def get_random_customer_id do
    Orders.Customer
    |> Ecto.Query.order_by(fragment("RANDOM()"))
    |> Ecto.Query.limit(1)
    |> Orders.Repo.one()
    |> Map.get(:id)
  end

  def get_random_products(n) do
    Orders.Product
    |> Ecto.Query.order_by(fragment("RANDOM()"))
    |> Ecto.Query.limit(^n)
    |> Orders.Repo.all()
  end
end
