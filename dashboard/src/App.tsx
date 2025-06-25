import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import "./index.css";
import { RecentOrders } from "./components/RecentOrders";
import { TopProducts } from "./components/TopProducts";
import { NewCustomers } from "./components/NewCustomers";
import { OrdersChart } from "./components/OrdersChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "./components/CodeBlock";
import { useState, useEffect } from "react";

export function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "home";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="container mx-auto p-8 max-w-[900px]">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>WTF is this?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you don't work with SQL databases but want to learn about them, you
                need to make one.  This project mocks up a simple online store, with
                randomly generated customers, orders etc.  It's a kooky learning project
                with each part of the store modelled as a microservice in a different
                language.  Each service has some common components, like data-faking,
                database interface, logging etc. In addition to the microservices, this
                dashboard contains a tiny API for this dashboard to call.
              </p>
              <br />
              <p >
                What started as a project to learn about databases morphed into an
                experiment in containerisation.  Initially I had a more realistic
                architecture with each microservice defining it's own docker image,
                and a docker compose file tying it all together.  This was good to play with,
                but is overkill for a toy project.  Now all services run in a single
                debian derived image. This is unrealistic, but it works.  The disadvantage is that you have to
                install postgres and haskell on the server by yourself, which is painful (it's uncommon to have
                build your own database image and Haskell makes everything difficult).
                To simplify even further there is no attached volume for the database, and so
                there is no data persistance. This is obviously very bad for a database but fine for this
                project.
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <RecentOrders />
            </div>
            <div className="col-span-1">
              <TopProducts />
            </div>
            <div className="col-span-1">
              <NewCustomers />
            </div>
          </div>
        </TabsContent>


        {/* Orders */}
        <TabsContent value="orders" className="mt-4">
          <div className="space-y-4">

            <Card>
              {/* <CardHeader> */}
              {/* <CardTitle>Source Code</CardTitle> */}
              {/* </CardHeader> */}
              <CardContent>
                <div className="p-2">
                  <a
                    href="https://github.com/hlud6646/storeSimul/blob/main/orders/lib/orders/newOrder.ex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    https://github.com/hlud6646/storeSimul/blob/main/orders/lib/orders/newOrder.ex
                  </a>
                </div>
                This process mocks the arrival of new orders by periodically picking a customer and some products and
                writing a new purchase order to the database.
              </CardContent>
            </Card>

            {/* <OrdersChart /> */}

            <Card>
              <CardHeader>
                <CardTitle>Schema</CardTitle>
              </CardHeader>
              <CardContent>
                Nothing exciting here. There's a non-null foreign key constraint,
                since every order must be associated with a customer.
                Timestamps are recorded with a timezone because
                <a
                  href="https://justatheory.com/2012/04/postgres-use-timestamptz/"
                  className="text-blue-500 hover:underline"
                >
                  {" "}that's what you do.{" "}
                </a>
                Note that you won't have a table called "order" in an SQL database,
                because that's a reserved word.
                <CodeBlock
                  language="sql"
                  code={`
CREATE TABLE purchase_order
(
    id         SERIAL PRIMARY KEY,
    customer   INTEGER                   NOT NULL REFERENCES customer (id),
    created    TIMESTAMPTZ DEFAULT now() NOT NULL,
    packed     TIMESTAMPTZ,
    dispatched TIMESTAMPTZ,
    address    TEXT                      NOT NULL
);`}
                />
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle>Elixir + OTP + Ecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                </div>
                <div>
                  <p>
                    This microservice is an OTP application written in Elixir.
                    It periodically creates a new purchase order and writes it to the database.

                    Out of all the database drivers used in the project, Ecto was the most
                    pleasant. You start by defining the schema, which is like a bridge between
                    the database and the elixir environment.

                    For example, to pull products from the database you would write:
                    <CodeBlock
                      language="elixir"
                      code={`
  schema "product" do
    field(:name, :string)
    field(:material, :string)
    field(:color, :string)
    field(:department, :string)
    field(:inventory, :integer)
  end                      `}
                    />
                    If you wanted to pull some random products from the database, you could write
                    <CodeBlock
                      language="elixir"
                      code={`
  defp get_random_products(n) do
    Orders.Product
    |> Ecto.Query.order_by(fragment("RANDOM()"))
    |> Ecto.Query.limit(^n)
    |> Orders.Repo.all()
  end                      `}
                    />
                    where the chain of function calls is structurally similar to what you would write in SQL.
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No code examples available for this service.</p>
              </CardContent>
            </Card> */}
            <RecentOrders />
          </div>
        </TabsContent>



        <TabsContent value="customers" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="p-2">
                  <a
                    href="https://github.com/hlud6646/storeSimul/blob/main/customers/customers/main.py"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    https://github.com/hlud6646/storeSimul/blob/main/customers/customers/main.py
                  </a>
                </div>
                The customers service is a simple Python program which periodically creates a new customer record.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema</CardTitle>
              </CardHeader>
              <CardContent>
                This is a fairly simple table definition that ensures email addresses are unique and demonstrates
                field validation. In reality you might use a more sophisticated validation strategy for email addresses
                but this is the general pattern for inline validation.
                <CodeBlock
                  language="sql"
                  code={`
CREATE TABLE customer
(
    email           TEXT UNIQUE,
    id              SERIAL PRIMARY KEY,
    name            TEXT                      NOT NULL,
    created         TIMESTAMP DEFAULT now()   NOT NULL,
    primary_address TEXT                      NOT NULL,
    CONSTRAINT check_email CHECK ((email ~~ '%@%'::TEXT))
); `}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Python + SQLAlchemy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                This program is simple, but I still wanted to use SQLAlchemy to see how the full ORM layer felt
                in Python. I don't like it much.
                <CodeBlock
                  language="python"
                  code={`
class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__                = "customer"
    id: Mapped[int]              = mapped_column(primary_key=True)
    name: Mapped[str]            = mapped_column(String())
    email: Mapped[str]           = mapped_column(String())
    primary_address: Mapped[str] = mapped_column(String())
`}
                />
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle>SQL Functions</CardTitle>
              </CardHeader>
              <CardContent>
                When a new customer joins ths store, we send them a welcome gift.
                This is implemented at the database level with a trigger and a function that
                is loaded after the tables are created.  The function is executed whenever a new
                customer record is created. All it does is pick a random product, decrement the inventory
                by one, and create a new purchase order for the customer.

                You can see the general pattern for this in the block below. You first create a function,
                a trigger that executes the function on a certain database event.
                <CodeBlock
                  language="sql"
                  code={`
CREATE OR REPLACE FUNCTION send_welcome_product() RETURNS TRIGGER AS
$welcome_product$
DECLARE
    product_id        INTEGER;
    purchase_order_id INTEGER;
BEGIN
    -- Create a new order for this customer, keeping the order_id.
    INSERT INTO purchase_order(customer, address)
    VALUES (NEW.id, NEW.primary_address)
    RETURNING id INTO purchase_order_id;

    -- Decrement the inventory of a randomly selected product and keep the id.
    SELECT id
    INTO product_id
    FROM product
    WHERE product.inventory >= 1
    ORDER BY random()
    LIMIT 1;
    UPDATE product SET inventory = inventory - 1 WHERE id = product_id;

    -- Add this product to the new order.
    INSERT INTO purchase_order_products(purchase_order, product, quantity)
    VALUES (purchase_order_id, product_id, 1);

    RAISE NOTICE 'New customer: %', NEW.id;
    RAISE NOTICE 'Created order %', purchase_order_id;
    RAISE NOTICE 'Added product % to order', product_id;

    -- Return is ignored since this is an AFTER trigger, but the editor wants one.
    RETURN NULL;
END;

$welcome_product$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER welcome_product
    AFTER INSERT
    ON customer
    FOR EACH ROW
EXECUTE FUNCTION send_welcome_product();`}
                />
              </CardContent>
            </Card>

            <NewCustomers />
          </div>
        </TabsContent>
        <TabsContent value="products" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="p-2">
                  <a
                    href="https://github.com/hlud6646/storeSimul/blob/main/products/src/main/scala/app.scala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    https://github.com/hlud6646/storeSimul/blob/main/products/src/main/scala/app.scala
                  </a>
                </div>
                The Products service is written in Scala and periodically creates new products and writes them to the database.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema</CardTitle>
              </CardHeader>
              <CardContent>
                The <code>product</code> table is simple, but it is referenced by several other tables,
                making it a central part of the database schema.
                <CodeBlock
                  language="sql"
                  code={`
CREATE TABLE product
(
    id         SERIAL PRIMARY KEY,
    name       TEXT    NOT NULL,
    material   TEXT,
    color      TEXT,
    department TEXT    NOT NULL,
    inventory  INTEGER NOT NULL,
    CONSTRAINT check_inventory CHECK ((inventory >= 0))
);`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scala + JDBC</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                This service uses the Java Database Connectivity (JDBC) API to interact with the PostgreSQL database.
                Below is an example of how a new product is created and inserted into the database.
                <CodeBlock
                  language="scala"
                  code={`
def writeNewProduct(connection: Connection) = {
  val statement = connection.createStatement()
  val sql =
    "INSERT INTO product (name, material, color, department, inventory) VALUES (?, ?, ?, ?, ?)"
  val preparedStatement = connection.prepareStatement(sql)

  val product = Product.random()
  preparedStatement.setString(1, product.name)
  preparedStatement.setString(2, product.material)
  preparedStatement.setString(3, product.color)
  preparedStatement.setString(4, product.department)
  preparedStatement.setInt(5, product.inventory)

  val rowsInserted = preparedStatement.executeUpdate()
  if (rowsInserted > 0) {
    logger.info(s"New product: $product")
  }
}
`}
                />
              </CardContent>
            </Card>
            <TopProducts />
          </div>
        </TabsContent>
        <TabsContent value="suppliers" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="p-2">
                  <a
                    href="https://github.com/hlud6646/storeSimul/blob/main/suppliers/app/Main.hs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    https://github.com/hlud6646/storeSimul/blob/main/suppliers/app/Main.hs
                  </a>
                </div>
                The Suppliers service is a Haskell program that periodically adds new suppliers and the products they offer to the database. It uses the
                <a href="https://hackage.haskell.org/package/postgresql-simple" className="text-blue-500 hover:underline"> postgresql-simple </a>
                library to interact with the database.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema</CardTitle>
              </CardHeader>
              <CardContent>
                A supplier can provide many products, and a product can be offered by many suppliers.
                This many-to-many relationship is modelled with a join table, <code>supplier_products</code>,
                that connects the <code>supplier</code> and <code>product</code> tables.
                <CodeBlock
                  language="sql"
                  code={`
CREATE TABLE supplier
(
    id      SERIAL PRIMARY KEY,
    name    TEXT NOT NULL,
    address TEXT NOT NULL,
    phone   TEXT,
    email   TEXT NOT NULL
);

CREATE TABLE supplier_products
(
    id          SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES supplier (id),
    product_id  INTEGER NOT NULL REFERENCES product (id),
    price       INTEGER NOT NULL
);`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Haskell + postgresql-simple</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                The <code>postgresql-simple</code> library provides a straightforward way to interact with a PostgreSQL database.
                You can see how a new supplier record is created and how product IDs are fetched. Note the use of <code>query</code> and <code>query_</code> for statements with and without parameters.
                <CodeBlock
                  language="haskell"
                  code={`
-- Insert a random supplier and return the new id.
writeNewSupplier :: Connection -> IO Int
writeNewSupplier conn = do
  supplier <- generateNonDeterministic fakeSupplier
  [Only id] <-
    query
      conn
      "INSERT INTO supplier (name, address, phone, email) \\
      \\ VALUES (?, ?, ?, ?) \\
      \\ RETURNING id"
      supplier
  return id

-- Pull 20 random product ids from the database.
readRandomProducts :: Connection -> IO [Int]
readRandomProducts conn = do
  ids <- query_ conn "SELECT id FROM product ORDER BY RANDOM() LIMIT 20"
  return $ map fromOnly ids
`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="p-2">
                  <a
                    href="https://github.com/hlud6646/storeSimul/blob/main/dashboard-api/main.py"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    https://github.com/hlud6646/storeSimul/blob/main/dashboard-api/main.py
                  </a>
                </div>
                This dashboard is powered by a simple FastAPI service that exposes a few endpoints to query the database.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                The API provides a few simple endpoints to fetch data for the dashboard. For example, the <code>/recent_orders</code> endpoint is implemented as follows:
                <CodeBlock
                  language="python"
                  code={`
@app.get("/recent_orders")
def read_recent_orders():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT po.id, c.name, po.created, po.address
        FROM purchase_order po
        JOIN customer c ON po.customer = c.id
        ORDER BY po.created DESC
        LIMIT 5;
    """)
    orders = cur.fetchall()
    cur.close()
    conn.close()
    return [{ "id": o[0], "customer": o[1], "date": o[2].strftime('%Y-%m-%d'), "address": o[3] } for o in orders]
`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
