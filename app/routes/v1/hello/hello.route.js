const { HelloController } = require('../../../controllers/v1');

module.exports = [{
    method: 'get',
    path: '/',
    auth: false,
    returnStatusCode: 200,
    handler: HelloController.sayHello,
}];
