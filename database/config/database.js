require('dotenv').config();

module.exports = {
    development: {
        username: 'root',
        password: null,
        database: 'db_dev',
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorsAliases: false
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'db_production',
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: false
    }
};
