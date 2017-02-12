var	errorUtils = require("../utils/errorUtils"),
	mongoose = require("mongoose"),
	underscore = require("underscore"),
	Route = mongoose.model("Route");


exports.save = function(route, req, res,  cb) {

	if (!route._id) {
		route = new Route(route);
	}

	route.save(req, function(error, newRoute) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(newRoute);
		}
	});
};

exports.getRoutesByUser = function(req, res, cb) {

	var criteria = {
		userId: req.user._id
	};

	var projection = {
		segments: 0,
		elevationPoints:0
	};
	
	var limit = 10;
	var skip = 0

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Route.findByCriteria(criteria, function(error, routes) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(routes);
		}
	}, projection, limit, skip);
};

exports.getRoutes = function(req, res, cb) {

	var criteria = {};

	var projection = {
		segments: 0,
		elevationPoints:0
	};

	var limit = 10;
	var skip = 0
	
	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Route.findByCriteria(criteria, function(error, routes) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(routes);
		}
	}, projection, limit, skip);

};

exports.findRoute = function(id, res, cb) {
	Route.findById(id, function(error, route) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(route);
		}
	});
};

exports.getRoute = function(req, res, cb) {
	var route = req.routeData
	if (!underscore.isUndefined(route)) {
		cb(route);
	} else {
		errorUtils.handleUnknownData(res);
	}
};

exports.deleteRoute = function(route, res, cb) {
	Route.deleteById(route._id, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	});
};

exports.updateRoute= function(route, req, res, cb) {

	var dataToUpdate = req.body;

    if (dataToUpdate._id) {
        delete dataToUpdate._id;
    }
    dataToUpdate.lastUpdate = new Date();

	var query = {
		_id: route._id
	};

	var update = {
		$set: dataToUpdate
	};

	var options = {
		upsert: true
	};

	Route.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.sendFeedback = function(feedback, res, cb) {
	email.sendEmailNewFeedback(feedback);
	cb();
};