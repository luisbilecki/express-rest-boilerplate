const { flatten } = require('lodash');
const { readdirSync } = require('fs');
const path = require('path');

const Joi = require('joi');

const { findFiles, getLastDirName } = require('../utils/files');
const DefaultError = require('../errors/defaultError');

const routesDir = __dirname;

const getApiVersions = () => {
    return readdirSync(routesDir)
        .reduce((previous, name) => {
            if (/v\d+/.test(name)) {
                previous.push(name);
            }

            return previous;
        }, []);
};

const getRoutePath = (baseUrl, version, directory, originalPath) => {
    return path.join(baseUrl, version, directory, originalPath);
};

const loadRoutes = (baseUrl = '') => {
    // Load version names
    const versions = getApiVersions();
    let apiRoutes = [];

    for (const version of versions) {
        const routeFiles = findFiles(path.join(routesDir, version), /(.*?)\.(route.js)$/);
        
        // Configure route with require
        const routes = routeFiles.map(file => {
            const directory = getLastDirName(file);
            const module = require(file);

            if (Array.isArray(module)) {
                for (const item of module) {
                    const originalPath = item.path;
                    item.path = getRoutePath(baseUrl, version, directory, originalPath);
                }
            } else {
                const originalPath = module.path;
                module.path = getRoutePath(baseUrl, version, directory, originalPath);
            }

            return module;
        });
        
        apiRoutes = apiRoutes.concat(flatten(routes));
    }

    return apiRoutes;
};

const validateData = (data, schema, req, next) => {
    // Return when schema is empty
    if (!schema) { 
        return;
    }

    // Validate using Joi
    const result = Joi.validate(data, schema);

    if (result.error) {
        return next(DefaultError.badRequest(req, result.error));
    }
};

const configureRoute = (app, route) => {     
    app[route.method](route.path, async function(req, res, next) {
        try {
            // Validate path
            validateData(req.params, route.pathSchema, req, next);

            // Validate query
            validateData(req.query, route.querySchema, req, next);

            // Validate route body
            validateData(req.body, route.bodySchema, req, next);

            await route.handler({ req, res, next });
        } catch(err) {
            next(DefaultError.internalServerError(err));
        }
    });

};

const registerRoutes = (app, baseUrl = '') => {
    // Load routes modules for each version
    const routes = loadRoutes(baseUrl);

    for (const route of routes) {
        configureRoute(app, route);
    }
};

const publicRoutes = (baseUrl = '') => {
    const routes = loadRoutes(baseUrl);

    return routes.filter(route => !route.auth);
};

module.exports = {
    registerRoutes,
    publicRoutes,
};
