const { query } = require('express-validator');
const { HelloController } = require('../../../controllers/v2');

module.exports = [{
    method: 'get',
    path: '/',
    validationRules: [
        query('name').isLength({ min: 2, max: 30 }),
    ],
    auth: false,
    handler: HelloController.sayHello,
}];
