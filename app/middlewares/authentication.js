
const middleware = async(req, res, next) => {
    // TODO: Implement your authentication logic here
    console.log('Authentication middleware called!');

    req.user = 123;

    next();
};

middleware.unless = require('express-unless');

module.exports = middleware;
