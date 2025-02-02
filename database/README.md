# Database

This image is a **Postgres** database server for the store.

## Building
Nothing fancy:
`docker build -t store/database .`

## Running
```bash
docker run --name store-db \
  --network store-network \
  -e POSTGRES_USER=storesimul \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=storesimul \
  -v ./data:/var/lib/postgres/data \
  -p 5432:5432 \
  -d store/database
```
Note: The POSTGRES_PASSWORD env var is required by the `postgres` base image.

## Query
Enter a psql session with
```
PGPASSWORD=secret psql -h localhost -p 5432 -U storesimul
```

## Gotchas
When you have multiple scripts that you want the docker instance to execute,
like a init_tables.sql and an init_procedures.sql, theses are run in **sorted order**.
Name them in the order that you want: 01_init_tables.sql etc...
