var errorUtils = require("../utils/errorUtils"),
	gridfsService = require("./gridfsService"),
	mongoose = require("mongoose"),
	underscore = require("underscore"),
	email = require("../middlewares/notification"),
	Race = mongoose.model("Race");


exports.save = function(race, req, res, cb) {

	if (!race._id) {
		race = new Race(race);
	}

	race.save(req, function(error, newRace) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			email.sendNewRace(req.user, race);
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
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Race.findByCriteria(criteria, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	}, projection, limit, skip);
};

exports.checkIfRaceNameAvailable = function(name, race, res, cb) {

	var criteria = {
		name: name,
		_id: {
			$ne: race._id
		}
	};

	Race.findByCriteria(criteria, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(races);
		}
	});
};

exports.checkIfRaceNameAlreadyExists = function(name, race, res, cb) {

	var criteria = {
		name: name,
		_id: {
			$ne: race._id
		}
	};

	Race.findByCriteria(criteria, function(error, races) {
		if (error) {
			errorUtils.handleError(res, error);
		} else if (races && races.length > 0) {
			errorUtils.handleRaceAlreadyExists(res, error);
		} else {
			cb();
		}
	});
};

exports.getRaces = function(req, res, cb) {

	var criteria = {};

	var projection = {
		registration: 0
	};

	var limit = 10;
	var skip = 0;

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
	var race = req.race;
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
		},
		published: true
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

	if (criteria) {

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

		if (criteria.place) {
			if (criteria.place.place_type === "locality") {

				var radius = criteria.radius || 60;

				if (criteria.place.location && criteria.place.location.latitude && criteria.place.location.longitude) {
					location = {
						"place.geo": {
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
					"place.administrative_area_level_1": criteria.place.administrative_area_level_1
				};
				andArray.push(administrative_area_level_1);

			} else if (criteria.place.place_type === "administrative_area_level_2") {
				var administrative_area_level_2 = {
					"place.administrative_area_level_2": criteria.place.administrative_area_level_2
				};
				andArray.push(administrative_area_level_2);
			} else if (criteria.place.place_type === "country") {
				var country = {
					"place.country": criteria.place.country
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
				coordinates: [fieldsToUpdate.place.location.latitude, fieldsToUpdate.place.location.longitude]
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

exports.uploadRights = function(race, path, originalName, res, cb) {

	gridfsService.storeFile(path, originalName, function(file) {

		var query = {
			_id: race._id
		};

		var update = {
			$set: {
				"rights.fileId": file._id
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

exports.deleteRightsFile = function(race, res, cb) {
	if (race.rights && race.rights.fileId) {
		gridfsService.deleteFile(race.rights.fileId, res, function() {
			cb();
		});
	} else {
		cb();
	}
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
		var base64 = (fbuf.toString("base64"));
		if (base64) {
			cb("data:image/png;base64," + base64);
		} else {
			cb();
		}

	});
};

exports.addResult = function(race, path, originalName, res, cb) {

	gridfsService.storeFile(path, originalName, function(file) {

		var query = {
			_id: race._id
		};

		var result = {
			name: originalName,
			year: 2012,
			fileId: file._id
		};

		var update = {
			$set: {
				lastUpdate: new Date()
			},
			$addToSet: {
				results: result
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



exports.getResult = function(fileId, res, cb) {
	gridfsService.getFile(fileId, res, function(bufs) {
		var fbuf = Buffer.concat(bufs);
		var base64 = (fbuf.toString("base64"));
		if (base64) {
			cb("data:image/png;base64," + base64);
		} else {
			cb();
		}

	});
};

exports.deleteResultFile = function(result, res, cb) {
	if (result.fileId) {
		gridfsService.deleteFile(result.fileId, res, function() {
			cb();
		});
	} else {
		cb();
	}
};

exports.deleteResult = function(race, result, res, cb) {
	var query = {
		_id: race._id
	};

	var update = {
		$set: {
			lastUpdate: new Date()
		},
		$pull: {
			results: result._id
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

exports.findResult = function(id, res, cb) {

	var criteria = {
		"results._id": id
	};

	var projection = {
		"results.$": 1
	};

	Race.findOneByCriteria(criteria, projection, function(error, result) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(result);
		}
	});
};