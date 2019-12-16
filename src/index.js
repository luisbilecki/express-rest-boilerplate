require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./logger');

const app = express();

// Protect express app with HTTP Headers
app.use(helmet());

// Enable CORS
const corsOptions = {
    origin: ['localhost:5000'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());

// HTTP request logger middleware
app.use(morgan('short', { stream: logger.stream }));

// TODO: load routes
app.get('/', function(req, res, next) {
    res.send('Hello World!');
});

// Add standardized error handler
app.use(require('./errors/handler'));

// Initialize server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
