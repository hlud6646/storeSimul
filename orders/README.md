# Orders

Be sure to run with `mix run --no-halt`.


## Run with environment variables on the store network:
``` bash
docker run --rm --name store-orders \
  --network store-network \
  -e DB_HOST=store-db \
  -e DB_PORT=5432 \
  -e DB_NAME=storesimul \
  -e DB_USER=storesimul \
  -e DB_PASSWORD=secret \
  -tid \
  store/orders:latest
```
