var errorUtils = require("../utils/errorUtils"),
	gridfsService = require("./gridfsService"),
	mongoose = require("mongoose"),
	underscore = require("underscore"),
	Race = mongoose.model("Race");


exports.save = function(race, req, res, cb) {

	if (!race._id) {
		race = new Race(race);
	}

	race.save(req, function(error, newRace) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(newRace);
		}
	});
};

exports.getRacesByUser = function(req, res, cb) {

	var criteria = {
		userId: req.user._id
	};

	var projection = {
		registration: 0
	};

	var limit = 10;
	var skip = 0

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Race.findByCriteria(criteria, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	}, projection, limit, skip);
};

exports.getRaces = function(req, res, cb) {

	var criteria = {};

	var projection = {
		registration: 0
	};

	var limit = 10;
	var skip = 0

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Race.findByCriteria(criteria, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	}, projection, limit, skip);

};

exports.findRace = function(id, res, cb) {
	Race.findById(id, function(error, race) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(race);
		}
	});
};

exports.getRace = function(req, res, cb) {
	var race = req.race
	console.log("Race" + race);
	if (!underscore.isUndefined(race)) {
		cb(race);
	} else {
		errorUtils.handleUnknownData(res);
	}
};

exports.deleteRace = function(race, res, cb) {
	Race.deleteById(race._id, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	});
};

exports.deleteRacesOfUser = function(user, res, cb) {
	var criteria = {
		userId: user._id
	};

	Race.deleteByCriteria(criteria, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	});
};

exports.publishRace = function(race, value, res, cb) {

	var query = {
		_id: race._id
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

	Race.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.autocomplete = function(text, res, cb) {

	var pattern = new RegExp("^" + text, "i");

	var criteria = {
		name: {
			$regex: pattern
		}
	};

	var projection = {
		name: 1,
		id: 1
	};

	var limit = 8;

	Race.findByCriteria(criteria, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	}, projection, limit);
};

exports.search = function(criteria, res, cb) {
	var query = {};
	var dateRange = {};
	var type = {};
	var andArray = [];
	var location = {};

	andArray.push({
		"published": true
	});

	if (criteria.dateRange && criteria.dateRange.startDate && criteria.dateRange.endDate) {
		dateRange = {
			"date": {
				"$gte": criteria.dateRange.startDate,
				"$lt": criteria.dateRange.endDate
			}
		};
		andArray.push(dateRange);
	}

	if (criteria.type) {
		type = {
			"type": criteria.type
		};
		andArray.push(type);

		if (criteria.distances && criteria.distances.length > 0) {

			var distances = {
				"distanceType": {
					$in: criteria.distances
				}
			};
			andArray.push(distances);
		}
	}

	if (criteria.location) {
		if (criteria.location.department && criteria.location.department.code) {

			var department = {
				"place.department.code": criteria.location.department.code
			}

			andArray.push(department);

		} else if (criteria.location.region && criteria.location.region.departments) {

			var departments = {
				"place.department.code": {
					$in: criteria.location.region.departments
				}
			};

			andArray.push(departments);

		} else {

			var radius = criteria.radius || 60;

			if (criteria.location.location && criteria.location.location.latitude && criteria.location.location.longitude) {
				location = {
					"place.geo": {
						$near: {
							$geometry: {
								type: "Point",
								coordinates: [criteria.location.location.latitude, criteria.location.location.longitude]
							},
							$maxDistance: radius * 1000
						}
					}
				};
				andArray.push(location);
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

	Race.findByCriteria(query, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	}, projection, limit);
};

exports.updateRouteRef = function(route, res, cb) {
	var query = {};

	var update = {
		$set: {
			lastUpdate: new Date()
		},
		$pull: {
			routes: route._id
		}
	};

	var options = {
		multi: true
	};

	Race.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.addRouteRef = function(race, route, res, cb) {
	var query = {
		_id: race._id
	};

	var update = {
		$set: {
			lastUpdate: new Date()
		},
		$addToSet: {
			routes: route._id
		}
	};

	var options = {};

	Race.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};


exports.updateRace = function(race, req, res, cb) {

	var fieldsToUpdate = req.body.fields;
	fieldsToUpdate.lastUpdate = new Date();

	var query = {
		_id: race._id
	};

	if (fieldsToUpdate.place) {
		if (fieldsToUpdate.place.location.latitude && fieldsToUpdate.place.location.longitude) {
			fieldsToUpdate.place.geo = {
				type: "Point",
				coordinates: [race.place.location.latitude, race.place.location.longitude]
			};
		}
	}

	var update = {
		$set: fieldsToUpdate
	};

	var options = {
		upsert: true
	};

	Race.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.uploadPicture = function(race, path, originalName, res, cb) {

	gridfsService.storeFile(path, originalName, function(file) {

		var query = {
			_id: race._id
		};

		var update = {
			$set: {
				pictureId: file._id
			}
		};

		var options = {
			upsert: true
		};

		Race.update(query, update, function(error) {
			if (error) {
				errorUtils.handleError(res, error);
			} else {
				cb();
			}
		}, options);
	});

};

exports.deletePicture = function(race, res, cb) {
	if (race.pictureId) {
		gridfsService.deleteFile(race.pictureId, res, function() {
			cb();
		});
	} else {
		cb();
	}
};

exports.downloadPicture = function(race, res, cb) {
	gridfsService.getFile(race.pictureId, res, function(bufs) {
		var fbuf = Buffer.concat(bufs);
		var base64 = (fbuf.toString('base64'));
		cb(base64);
	});
};