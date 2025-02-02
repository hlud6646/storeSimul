# Products

This is a **Scala** program that creates random products and adds them to the database.

## Build the Jar
Build an uber-jar with `sbt assembly`, which should output to
`./target/scala-3.6.2/products-assembly-0.1.0-SNAPSHOT.jar`
Then build the docker instance.
Best to combine these two steps with
`sbt assembly && docker build -t store/products .`

## Container
The only dependencies in the docker container will be the java runtime and psql.

## Run with environment variables on the store network:
``` bash
docker run --rm --name store-products \
  --network store-network \
  -e DB_HOST=store-db \
  -e DB_PORT=5432 \
  -e DB_NAME=storesimul \
  -e DB_USER=storesimul \
  -e DB_PASSWORD=secret \
  -tid \
  store/products:latest
```

## Questions
- Is there any way to get compile time info about your database access?
