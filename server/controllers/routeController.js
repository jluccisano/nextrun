var routeService = require("../services/routeService");

exports.loadRoute = function(req, res, next, id) {
    routeService.findRoute(id, res, function(route) {
        req.routeData = route;
        next();
    });
};

exports.getRoute = function(req, res) {
    routeService.getRoute(req, res, function(route) {
        res.status(200).json(route);
    });
};

exports.createRoute = function(req, res) {
    var route = req.body;
    routeService.save(route, req, res, function(newRoute) {
        res.status(200).json({
            id: newRoute._id
        });
    });
};

exports.updateRoute = function(req, res) {
    var route = req.routeData;
    routeService.updateRoute(route, req, res, function() {
        res.status(200).json({
            id: route._id
        });
    });
};

exports.getRoutes = function(req, res) {
    routeService.getRoutes(req, res, function(routes) {
        res.status(200).json({
            items: routes
        });
    });
};

exports.getRoutesByUser = function(req, res) {
    routeService.getRoutesByUser(req, res, function(routes) {
        res.status(200).json({
            items: routes
        });
    });
};

exports.deleteRoute = function(req, res) {
    var route = req.routeData;
    routeService.deleteRoute(route, res, function() {
        res.sendStatus(200);
    });
};

exports.publishRoute = function(req, res) {
    var route = req.routeData;
    routeService.publishRoute(route, true, res, function() {
        res.sendStatus(200);
    });
};

exports.unpublishRoute = function(req, res) {
    var route = req.routeData;
    routeService.publishRoute(route, false, res, function() {
        res.sendStatus(200);
    });
};