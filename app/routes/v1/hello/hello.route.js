const { HelloController } = require('../../../controllers/v1');

module.exports = [{
    method: 'get',
    path: '/',
    auth: false,
    handler: HelloController.sayHello,
}];
