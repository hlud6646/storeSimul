# Customers

This **Python** program mimicks the creation of customers.


## Run with environment variables on the store network:
``` bash
docker run --rm --name store-customers \
  --network store-network \
  -e DB_HOST=store-db \
  -e DB_PORT=5432 \
  -e DB_NAME=storesimul \
  -e DB_USER=storesimul \
  -e DB_PASSWORD=secret \
  -tid \
  store/customers:latest
```
