const Joi = require('joi'); 

const { HelloController } = require('../../../controllers/v2');

module.exports = [{
    method: 'get',
    path: '/',
    querySchema: Joi.object().keys({ 
        name: Joi.string().alphanum().min(3).max(30).required(),
    }),
    auth: false,
    handler: HelloController.sayHello,
}];
