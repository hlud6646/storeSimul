import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import "./index.css";
import { TopCustomersChart } from "./components/TopCustomersChart";
import { OrdersLineChart } from "./components/OrdersLineChart";
import { ProductDepartmentPieChart } from "./components/ProductDepartmentPieChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { SupplierProductProportionChart } from "./components/SupplierProductProportionChart";

export function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "home";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-auto flex-col items-center bg-background px-4">
        <div className="w-full max-w-[900px] py-4">
          <h1 className="text-3xl font-bold">Store Simulation</h1>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-[900px]"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="flex flex-col items-center p-8">
        <div className="w-full max-w-[900px]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="home" className="mt-4">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>WTF is this?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    If you don't work with SQL databases but want to learn about
                    them, you need to make one. This project mocks up a simple
                    online store, with randomly generated customers, orders etc.
                    It's a kooky learning project with each part of the store
                    modelled as a microservice in a different language. Each
                    service has some common components, like data-faking,
                    database interface, logging etc. In addition to the
                    microservices, there's a tiny API for this dashboard to
                    call.
                  </p>
                  <br />
                  <p>
                    What started as a project to learn about databases morphed
                    into an experiment in containerisation. Initially I had a
                    more realistic architecture with each microservice defining
                    it's own docker image, and a docker compose file tying it
                    all together. This was good to play with, but is overkill
                    for a toy project. Now all services run in a single debian
                    derived image. This is unrealistic, but it works. The
                    disadvantage is that you have to install postgres and
                    haskell on the server by yourself, which is painful (it's
                    uncommon to build your own database image, and Haskell
                    makes everything difficult). To simplify even further there
                    is no attached volume for the database, and so there is no
                    data persistance. This is obviously very bad for a database
                    but fine for this project.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="mt-4">
              <div className="space-y-4">
                <Card>
                  {/* <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
              </CardHeader> */}
                  <CardContent>
                    <OrdersLineChart />
                  </CardContent>
                </Card>

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
                    This process mocks the arrival of new orders by periodically
                    picking a customer and some products and writing a new
                    purchase order to the database. It's an OTP application
                    written in Elixir, using the very lovely Ecto library for
                    database interaction.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="mt-4">
              <div className="space-y-4">
                <TopCustomersChart />
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
                    The customers service is a simple Python program which
                    periodically creates a new customer record. It uses the
                    SQLAlchemy object relational mapper to interact with the
                    database.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>SQL Functions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    When a new customer joins ths store, we send them a welcome
                    gift. This is implemented at the database level with a
                    trigger and a function that is loaded after the tables are
                    created. The function is executed whenever a new customer
                    record is created. All it does is pick a random product,
                    decrement the inventory by one, and create a new purchase
                    order for the customer. It follows the general pattern of
                    first creating a function in `plpgsql`, and then a trigger
                    that executes the function on certain database events.
                  </CardContent>
                </Card>

                {/* <NewCustomers /> */}
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              <div className="space-y-4">
                <ProductDepartmentPieChart />
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
                    The Products service is written in Scala and periodically
                    creates new products and writes them to the database. It
                    uses the Java.Sql interface to interact with the database.
                    This is a simple solution (not a fancy ORM). It's nice to be
                    reminded of how strong the ineterop can be between different
                    languages on the JVM.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="mt-4">
              <div className="space-y-4">
                <SupplierProductProportionChart />
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
                    The Suppliers service is a Haskell program that periodically
                    adds new suppliers and the products they offer to the
                    database. It uses the
                    <a
                      href="https://hackage.haskell.org/package/postgresql-simple"
                      className="text-blue-500 hover:underline"
                    >
                      {" "}
                      postgresql-simple{" "}
                    </a>
                    library to interact with the database.
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
                    This dashboard is powered by a simple FastAPI service that
                    exposes the database schema as a REST API. I let the llm
                    run wild with this one, and it provided a good example of
                    building to the job. Where I would have reached for{" "}
                    <code>SqlAlchemy</code> and subclassed `pydantic.Basemodel`, it
                    just wrote some SQL in the API handler, and made the
                    handler return a list of python dictionaries. FastApi is
                    smart enough to convert this to JSON.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default App;
