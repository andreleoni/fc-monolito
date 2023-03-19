# Monolith estructure module based

## Run tests

`npm run test`

## Run server

`npm run server`

# Requests

## Create product

```
curl -d '{"name": "my product", "description": "value2", "price": 230, "stock": 1}' -H "Content-Type: application/json" -X POST localhost:3030/products
```

# Create Client

```
curl -d '{"name": "leoni test", "email": "email@domain.com", "document": "00000000", "street": "Avenue Software", "number": "123", "complement": "Ap 400", "city": "my city", "state": "my state", "zipCode": "89213321"}' -H "Content-Type: application/json" -X POST localhost:3030/clients
```

# Checkout

```
curl -d '{"clientId": "a1246375-98c3-49d3-8b19-535830ca19e3", "products": [{ "productId": "7a580b0c-a269-404a-8ef4-59d7de6ae565" }]}' -H "Content-Type: application/json" -X POST localhost:3030/checkout
```
