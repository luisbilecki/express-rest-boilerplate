# Express REST Boilerplate

This repository contains a boilerplate of a REST API using Express and Sequelize.

--------------

## Requirements

This app is not docker based, so you should install Node.js, in order to run the API server.

```
Node.js >= 10.x
Postgres (RDBMS used in development and production)
SQLite (for testing env)
```
--------------
## How to run

1. Run `yarn install` to install required dependencies for this project;

2. Create .env file using the provided template (.env.example);

3. Run API using:
```bash
    yarn start

    or

    node app/index.js
```

4. Run tests using the following command:
```bash
    yarn test
```

5. Linting can be checked using:
```bash
    yarn lint
```
--------------

## Route definition:

This boilerplate considers versioning in routing. To create a route or routes, please add a new file in `routes` folder using the following syntax:
```bash
    routes/{version}/{resource_name}/{filename}.{route|routes}.js
```

Each route file can accept an object (one route) or an array of objects (more than one route). Please see below how a route is defined:
```javascript
// Route definition
module.exports = [{
    method: 'get', // HTTP method: get, post, path, put, delete
    path: '/', // route path, path params can be used
    auth: false|true, // when this param is true, auth middleware is called
    validationRules: [], // validation uses express-validator rules (https://express-validator.github.io/docs/)
    returnStatusCode: 200, // default status code that will be returned when route is called (res.status(<code here>))
    handler: ({ req, res, next, pathParams, bodyParams, queryParams }) => { // route code/logic (should be a controller function)
        res.send('Ok!');
    },
}];
``` 
--------------

## Route example:

`/routes/v2/hello/hello.route.js`

```javascript
const { query } = require('express-validator');

module.exports = [{
    method: 'get',
    path: '/',
    validationRules: [
        query('name').isLength({ min: 2, max: 30 }),
    ],
    returnStatusCode: 200,
    auth: false,
    handler: ({ queryParams }) => {
        return `Hello ${queryParams.name}. V2 API is working!`;
    },
}];
```

The route file defined above will generate the endpoint:

| HTTP Method 	| HTTP Path 	| Private Endpoint 	| Query Params 	| Path Params 	| Body Params 	|
|-------------	|-----------	|------------------	|--------------	|-------------	|-------------	|
| GET         	| /v2/hello 	| False            	| name: string 	| -           	| -           	|
