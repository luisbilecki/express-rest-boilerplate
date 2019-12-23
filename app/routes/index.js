const { flatten, get } = require('lodash');
const { readdirSync } = require('fs');
const { validationResult } = require('express-validator');
const path = require('path');

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

const getRoutePath = (baseUrl, route) => {
    const routePath = route.path === '/' ? '' : route.path;
    
    return path.join(baseUrl, route.version, route.resource, routePath);
};

const updateRouteDefinition = (route, version, resource) => {
    route.version = version;
    route.resource = resource;

    return route;
};

const loadRoutes = () => {
    const versions = getApiVersions();

    return versions.reduce((previous, version) => {
        const routeFiles = findFiles(path.join(routesDir, version), /(.*?)\.(route.js)$/);
        
        const routes = routeFiles.map(file => {
            const resource = getLastDirName(file);
            const module = require(file);

            Array.isArray(module) ? 
                module.forEach(route => updateRouteDefinition(route, version, resource)) : // [{ route }, { route }]
                updateRouteDefinition(module, version, resource); // { route }

            return module;
        });

        return previous.concat(flatten(routes));
    }, []);
};

const handleValidationResult = (req, res, next) => {
    const errors = validationResult(req);       
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    
    return next(DefaultError.badRequest(req, errors));    
};

const configureRoute = (app, baseUrl, route) => {  
    const newPath = getRoutePath(baseUrl, route);
    const validationRules = get(route, 'validationRules', []);

    app[route.method](newPath, validationRules, handleValidationResult, 
        async(req, res, next) => {
            // Extract params and pass to route handler
            const queryParams = req.query;
            const pathParams = req.params;
            const bodyParams = req.body;

            try {
                // Get result from controller and not use res.json / send in controller
                const result = await route.handler({ req, res, next, queryParams, pathParams, bodyParams });

                res.status(route.returnStatusCode || 200);
                res.json(result);
            } catch(err) {
                next(DefaultError.internalServerError(err));
            }
        }
    );
};

const registerRoutes = (app, baseUrl = '') => {
    loadRoutes()
        .forEach(route => configureRoute(app, baseUrl, route));
};

const publicRoutes = (baseUrl = '') => {
    return loadRoutes().filter(route => !route.auth)
        .map(route => getRoutePath(baseUrl, route));
};

module.exports = {
    registerRoutes,
    publicRoutes,
};
