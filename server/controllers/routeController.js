/**
 * @module Route Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
    Route = mongoose.model("Route"),
    errorUtils = require("../utils/errorUtils"),
    underscore = require("underscore");

/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {
    Route.load(id, function(error, route) {
        if (error) {
            errorUtils.handleError(error);
        }
        if (!route) {
            errorUtils.handleUnknownId();
        }
        req.routeData = route;
        next();
    });
};

exports.create = function(req, res) {
    var userConnected = req.user;

    var route = new Route(req.body.route);
    route.userId = userConnected._id;
    route.lastUpdate = new Date();
    route.creationDate = new Date();

    route.save(function(error, route) {
        if (error) {
            errorUtils.handleError(error);
        } else {
            return res.status(200).json({
                routeId: route._id
            });
        }
    });
};

exports.update = function(req, res) {
    var route = req.routeData;
    var data = req.body.query;

    var fieldsToUpdate = data.fields;

    var query = {};
    if (!underscore.isUndefined(data.query)) {
        query = data.query;
    }

    query._id = route._id;

    Route.update(query, {
        $set: fieldsToUpdate
    }, {
        upsert: true
    }, function(error) {
        if (error) {
            errorUtils.handleError(error);
        } else {
            return res.sendStatus(200);
        }
    });
};

/**
 * @method find route
 * @param req
 * @param res
 * @returns route loaded by load parameter id
 */
exports.find = function(req, res) {
    var route = req.routeData;

    if (!underscore.isUndefined(route)) {
        return res.status(200).json({
            data: route
        });
    } else {
        return res.status(400).json({
            message: ["error.unknownRoute"]
        });
    }
};

/**
 * @method find by user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.findByUser = function(req, res) {

    var criteria = {};
    var page = 1;
    var perPage = 10;

    criteria = {
        userId: req.user._id
    };

    if (typeof req.params.page !== "undefined") {
        page = req.params.page;
    }

    var options = {
        perPage: perPage,
        page: page - 1,
        criteria: criteria
    };

    Route.findByCriteria(options, function(err, routes) {
        if (err) {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
        if (routes) {
            return res.status(200).json({
                routes: routes
            });
        } else {
            logger.error("error.occured");
            return res.status(400).json({
                message: ["error.occured"]
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
    console.log("route:" + route._id);
    Route.destroy(route._id, function(err) {
        if (!err) {
            return res.sendStatus(200);
        } else {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
    });
};