var errorUtils = require("../utils/errorUtils"),
	mongoose = require("mongoose"),
	email = require("../middlewares/notification"),
	Route = mongoose.model("Route");


exports.save = function(route, req, res, cb) {

	if (!route._id) {
		route = new Route(route);
	}

	route.save(req, function(error, newRoute) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			email.sendNewRoute(req.user, route);
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
		elevationPoints: 0
	};

	var limit = 10;
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Route.findByCriteria(criteria, function(error, routes) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			Route.countTotal(criteria, function(error, count) {
				if (error) {
					errorUtils.handleError(res, error);
				} else {
					cb({
						items: routes,
						total: count,
						limit: limit,
						skip: skip
					});
				}
			});
		}
	}, projection, limit, skip);
};

exports.getRoutes = function(req, res, cb) {

	var criteria = {};

	var projection = {
		segments: 0,
		elevationPoints: 0
	};

	var limit = 10;
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Route.findByCriteria(criteria, function(error, routes) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			Route.countTotal(criteria, function(error, count) {
				if (error) {
					errorUtils.handleError(res, error);
				} else {
					cb({
						items: routes,
						total: count,
						limit: limit,
						skip: skip
					});
				}
			});
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
	var route = req.routeData;
	cb(route);
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

exports.updateRoute = function(route, req, res, cb) {

	var dataToUpdate = req.body;

	if (dataToUpdate._id) {
		delete dataToUpdate._id;
	}
	dataToUpdate.lastUpdate = new Date();

	if (dataToUpdate.startPlace) {
		if (dataToUpdate.startPlace.location.latitude && dataToUpdate.startPlace.location.longitude) {
			dataToUpdate.startPlace.geo = {
				type: "Point",
				coordinates: [dataToUpdate.startPlace.location.latitude, dataToUpdate.startPlace.location.longitude]
			};
		}
	}

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

exports.publishRoute = function(route, value, res, cb) {

	var query = {
		_id: route._id
	};

	var update = {
		$set: {
			lastUpdate: new Date(),
			published: value,
			publicationDate: new Date()
		}
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

exports.search = function(criteria, res, cb) {
	var query = {};
	var dateRange = {};
	var type = {};
	var andArray = [];
	var location = {};

	if (criteria) {

		andArray.push({
			published: true
		});

		if (criteria.type) {
			type = {
				"type": criteria.type
			};
			andArray.push(type);
		}

		if (criteria.place) {
			if (criteria.place.place_type === "locality") {

				var radius = criteria.radius || 60;

				if (criteria.place.location && criteria.place.location.latitude && criteria.place.location.longitude) {
					location = {
						"startPlace.geo": {
							$near: {
								$geometry: {
									type: "Point",
									coordinates: [criteria.place.location.latitude, criteria.place.location.longitude]
								},
								$maxDistance: radius * 1000
							}
						}
					};
					andArray.push(location);
				}
			} else if (criteria.place.place_type === "administrative_area_level_1") {
				var administrative_area_level_1 = {
					"startPlace.administrative_area_level_1": criteria.place.administrative_area_level_1
				};
				andArray.push(administrative_area_level_1);

			} else if (criteria.place.place_type === "administrative_area_level_2") {
				var administrative_area_level_2 = {
					"startPlace.administrative_area_level_2": criteria.place.administrative_area_level_2
				};
				andArray.push(administrative_area_level_2);
			} else if (criteria.place.place_type === "country") {
				var country = {
					"startPlace.country": criteria.place.country
				};
				andArray.push(country);
			}
		}
	}

	if (andArray.length > 0) {
		query = {
			$and: andArray
		};
	}

	var projection = {
		routes: 0
	};

	var limit = 100;

	Route.findByCriteria(query, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	}, projection, limit);
};