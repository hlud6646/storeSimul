# Database

This image is a **Postgres** database server for the store.

## Building
Nothing fancy:
`docker build -t dev/database01 .`

## Running
```bash
docker run --name some-db \
  -e POSTGRES_USER=storesimul \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=storesimul \
  -p 5431:5432 \
  -v ./data:/var/lib/postgres/data \
  -d dev/database01
```
- The POSTGRES_PASSWORD env var is required by the `postgres` base image.

## Query
Enter a psql session with
```
PGPASSWORD=secret psql -h localhost -p 5431 -U storesimul
```

## Gotchas
When you have multiple scripts that you want the docker instance to execute, 
like a init_tables.sql and an init_procedures.sql, theses are run in **sorted order**.
Name them in the order that you want: 01_init_tables.sql etc...

