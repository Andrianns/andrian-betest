# Project Name

ms-andrian-betest

## Installation

To get started, clone the repository and navigate into the project directory. Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash

# Navigate to the project folder
cd ms-andrian-betest

# Install dependencies
npm install

# Run the application
npm start

# or, if using nodemon for auto-reloading during development
nodemon app
```

# Account for Generating Token

To generate a token, send a POST request with the following request body to the authentication endpoint

```json
POST /generate-token
{
  "userName": "admin",
  "accountNumber": "123"
}
```

## List Endpoint

```
GET '/users'
GET 'users/find'
POST '/users'
PUT '/users/:_id'
DELETE '/users/:_id'
```

## Build the Docker Image

`docker build -t andrian/docker-betest:1.0 ./`

## Run Docker Container

`docker container run --name app -p 3000:3000 andrian/docker-betest:1.0`
