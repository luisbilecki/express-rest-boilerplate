
const middleware = async(req, res, next) => {
    console.log('Authentication middleware called!');

    req.user = 123;

    next();
};

middleware.unless = require('express-unless');

module.exports = middleware;
