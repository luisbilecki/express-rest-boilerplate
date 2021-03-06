require('dotenv').config();

module.exports = {
    development: {
        url: process.env.DEV_DATABASE_URL,
        dialect: 'postgres',
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory'
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
    },
};
