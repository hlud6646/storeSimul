defmodule Orders.NewOrder do
  use GenServer
  import Ecto.Query
  import Faker.Address.En

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], [])
  end

  @impl true
  def init(_) do
    IO.puts("Creating a new order...")

    customer_id = get_random_customer_id()
    address = "#{street_address()}, #{city()}, #{zip_code()}, #{state()}"
    {:ok, order} = Orders.Repo.insert(%Orders.Order{customer: customer_id, address: address})
    products = get_random_products(1 + :rand.uniform(10))

    order_products = make_order_products(products, order)

    order_products
    |> Enum.each(&Orders.Repo.insert/1)

    IO.inspect(order_products)

    {:ok, nil}
  end

  def get_random_customer_id do
    Orders.Customer
    |> order_by(fragment("RANDOM()"))
    |> limit(1)
    |> Orders.Repo.one()
    |> Map.get(:id)
  end

  def get_random_products(n) do
    Orders.Product
    |> Ecto.Query.order_by(fragment("RANDOM()"))
    |> Ecto.Query.limit(^n)
    |> Orders.Repo.all()
  end

  def make_order_products(products, order) do
    products
    |> Enum.map(fn product ->
      %Orders.OrderProduct{
        order: Map.fetch!(order, :id),
        product: Map.get(product, :id),
        quantity: min(:rand.uniform(30), Map.get(product, :inventory))
      }
    end)
  end
end
