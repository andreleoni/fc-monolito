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
curl -d '{"clientId": "5b5b930e-d0c9-4780-a7af-57a3dcdf6c38", "products": [{ "productId": "bbeea934-c1b5-4a1d-a1d7-72c1d4d4a620" }]}' -H "Content-Type: application/json" -X POST localhost:3030/checkout
```

# Invoice

```
curl -H "Content-Type: application/json" -X GET localhost:3030/invoice/:invoiceID
```
