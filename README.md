# Monolith estructure module based

## Run tests

`npm run test`

## Run server

`npm run server`

# Requests

## Get products

```
$ curl localhost:3030/products
{"products":[]}
```

## Create product

```
$ curl -d '{"name": "my product", "description": "value2", "price": 230, "stock": 1}' -H "Content-Type: application/json" -X POST localhost:3030/products
{"id":"ddd14375-bd8c-4c73-bf4e-1a3d3f68b233","name":"my product","description":"value2","purchasePrice":230,"stock":1,"createdAt":"2023-03-19T14:19:15.654Z","updatedAt":"2023-03-19T14:19:15.654Z"}
```

# Create Client

```
curl -d '{"name": "leoni test", "email": "email@domain.com", "address": "Avenue Software 123"}' -H "Content-Type: application/json" -X POST localhost:3030/clients
```
