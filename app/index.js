require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./logger');
const { authMiddleware } = require('./middlewares');
const Routes = require('./routes');

const app = express();
const baseUrl = '/api';

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

// JSON Body parser middleware
app.use(express.json());

// HTTP request logger middleware
app.use(morgan('short', { stream: logger.stream }));

// Middleware authentication
app.use(authMiddleware.unless({ path: Routes.publicRoutes(baseUrl) }));

// Load app routes
Routes.registerRoutes(app, baseUrl);

// Add standardized error handler
app.use(require('./errors/handler'));

// Initialize server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Exports server for testing purposes
module.exports = app;
