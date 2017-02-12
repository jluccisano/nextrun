/**
 * @module Race Controller
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
        req.route = route;
        next();
    });
};

exports.create = function(req, res) {
    var userConnected = req.user;

    var route = new Route(req.body.data);
    route.userId = userConnected._id;

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
    var route = req.route;
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
    var route = req.route;

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