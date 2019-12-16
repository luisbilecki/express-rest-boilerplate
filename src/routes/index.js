const { flatten } = require('lodash');
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
    return path.join(baseUrl, route.version, route.resource, route.path);
};

const updateRouteDefinition = (route, version, resource) => {
    route.version = version;
    route.resource = resource;

    return route;
};

const loadRoutes = () => {
    // Load version names
    const versions = getApiVersions();
    let apiRoutes = [];

    for (const version of versions) {
        const routeFiles = findFiles(path.join(routesDir, version), /(.*?)\.(route.js)$/);
        
        // Configure route with require
        const routes = routeFiles.map(file => {
            const resource = getLastDirName(file);
            const module = require(file);

            if (Array.isArray(module)) {
                module.forEach(route => updateRouteDefinition(route, version, resource));
            } else {
                updateRouteDefinition(module, version, resource);
            }

            return module;
        });
        
        apiRoutes = apiRoutes.concat(flatten(routes));
    }

    return apiRoutes;
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

const configureRoute = (app, route, newPath) => {     
    app[route.method](newPath, route.validationRules || [], handleValidationResult, 
        async(req, res, next) => {
            try {
                await route.handler({ req, res, next });
            } catch(err) {
                next(DefaultError.internalServerError(err));
            }
        }
    );
};

const registerRoutes = (app, baseUrl = '') => {
    // Load routes modules for each version
    const routes = loadRoutes();

    for (const route of routes) {
        const newPath = getRoutePath(baseUrl, route);

        configureRoute(app, route, newPath);
    }
};

const publicRoutes = (baseUrl = '') => {
    const routes = loadRoutes();

    return routes.filter(route => !route.auth)
        .map(route => getRoutePath(baseUrl, route));
};

module.exports = {
    registerRoutes,
    publicRoutes,
};
