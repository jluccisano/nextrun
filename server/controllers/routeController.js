/**
 * @module Route Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
    Route = mongoose.model("Route"),
    errorUtils = require("../utils/errorUtils"),
    mongooseUtils = require("../utils/mongooseUtils"),
    underscore = require("underscore");

/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {
    mongooseUtils.load(req, res, next, id, Route, "routeData");
    /*Route.load(id, function(error, route) {
        if (error) {
            errorUtils.handleError(res, error);
        } else if (!route) {
            errorUtils.handleUnknownId(res);
        } else {
            req.routeData = route;
            next();
        }
    });*/
};

exports.create = function(req, res) {
    var route = new Route(req.body);
    mongooseUtils.save(req, res, route);
    /*var route = new Route(req.body);
    var userConnected = req.user;

    route.userId = userConnected._id;
    
    route.save(function(error, route) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                routeId: route._id
            });
        }
    });*/
};

exports.update = function(req, res) {
    var route = req.routeData;
    var dataToUpdate = req.body;

    if (dataToUpdate._id) {
        delete dataToUpdate._id;
    }
    dataToUpdate.lastUpdate = new Date();

    Route.update({
        _id: route._id
    }, {
        $set: dataToUpdate
    }, {
        upsert: true
    }, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                id: route._id
            });
        }
    });
};

/**
 * @method find route
 * @param req
 * @param res
 * @returns route loaded by parameter id
 */
exports.find = function(req, res) {
    mongooseUtils.find(req, res, "routeData");
    /*var route = req.routeData;
    if (!underscore.isUndefined(route)) {
        res.status(200).json(route);
    } else {
        errorUtils.handleUnknownData(res);
    }*/
};

/**
 * @method find by user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.findByUser = function(req, res) {
    var page = 1;
    var perPage = 10;
    var criteria = {
        userId: req.user._id
    };

    if (req.params.page) {
        page = req.params.page;
    }

    var options = {
        perPage: perPage,
        page: page - 1,
        criteria: criteria
    };

    Route.findByCriteria(options, function(error, routes) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: routes
            });
        }
    });
};



/**
 * @method delete route
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    var route = req.routeData;
    mongooseUtils.delete(req, res, route._id, Route);
    /*Route.destroy(route._id, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });*/
};