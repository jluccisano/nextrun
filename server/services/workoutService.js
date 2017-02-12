var errorUtils = require("../utils/errorUtils"),
	mongoose = require("mongoose"),
	email = require("../middlewares/notification"),
	Workout = mongoose.model("Workout");


exports.save = function(workout, req, res, cb) {

	if (!workout._id) {
		workout = new Workout(workout);
	}

	workout.save(req, function(error, newWorkout) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			email.sendNewWorkout(req.user, workout);
			cb(newWorkout);
		}
	});
};

exports.getWorkoutsByUser = function(req, res, cb) {

	var criteria = {
		userId: req.user._id
	};

	var projection = {};

	var limit = 10;
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Workout.findByCriteria(criteria, function(error, workouts) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(workouts);
		}
	}, projection, limit, skip);
};

exports.getWorkouts = function(req, res, cb) {

	var criteria = {};

	var projection = {};

	var limit = 10;
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Workout.findByCriteria(criteria, function(error, workouts) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(workouts);
		}
	}, projection, limit, skip);

};

exports.findWorkout = function(id, res, cb) {
	Workout.findById(id, function(error, workout) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(workout);
		}
	});
};

exports.getWorkout = function(req, res, cb) {
	var workout = req.workout;
	cb(workout);
};

exports.deleteWorkout = function(workout, res, cb) {
	Workout.deleteById(workout._id, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	});
};

exports.updateWorkout = function(workout, req, res, cb) {

	var dataToUpdate = req.body;

	if (dataToUpdate._id) {
		delete dataToUpdate._id;
	}
	dataToUpdate.lastUpdate = new Date();

	var query = {
		_id: workout._id
	};

	if (dataToUpdate.place) {
		if (dataToUpdate.place.location.latitude && dataToUpdate.place.location.longitude) {
			dataToUpdate.place.geo = {
				type: "Point",
				coordinates: [dataToUpdate.place.location.latitude, dataToUpdate.place.location.longitude]
			};
		}
	}

	var update = {
		$set: dataToUpdate
	};

	var options = {
		upsert: true
	};

	Workout.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.updateParticipant = function(workout, participant, req, res, cb) {

	var participantId = participant._id;

	var query = {
		_id: workout._id,
		"participants._id": participantId
	};

	var update = {
		$set: {
			"participants.$": participant
		}
	};

	var options = {
		multi: true
	};

	Workout.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.addParticipant = function(workout, participant, res, cb) {
	var query = {
		_id: workout._id
	};

	var update = {
		$set: {
			lastUpdate: new Date()
		},
		$addToSet: {
			participants: participant
		}
	};

	var options = {};

	Workout.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.deleteParticipant = function(workout, participantId, res, cb) {
	var query = {};

	var update = {
		$set: {
			lastUpdate: new Date()
		},
		$pull: {
			participants: {
				_id: participantId
			}
		}
	};

	var options = {
		multi: true
	};

	Workout.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.findParticipant = function(workout, participant, res, cb) {

	var criteria = {
		"_id": workout._id,
		"participants.email": participant.email
	};

	var projection = {
		"participants.$": 1
	};

	Workout.findOneByCriteria(criteria, projection, function(error, workout) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			if (workout && workout.participants && workout.participants.length > 0) {
				cb(workout.participants[0]);
			} else {
				cb();
			}

		}
	});
};

exports.checkIfParticipantAlreadyExists = function(participant, workout, res, cb) {

	var criteria = {
		"_id": workout._id,
		"participants.email": participant.email
	};

	var projection = {
		"participants.$": 1
	};

	Workout.findOneByCriteria(criteria, projection, function(error, workout) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			if (workout && workout.participants && workout.participants.length > 0) {
				errorUtils.handleParticipantAlreadyExists(res, error);
			} else {
				cb();
			}

		}
	});
};

exports.checkIfParticipantAvailable = function(participantEmail, workout, res, cb) {

	var criteria = {
		"_id": workout._id,
		"participants.email": participantEmail
	};

	var projection = {
		"participants.$": 1
	};

	Workout.findByCriteria(criteria, projection, function(error, participants) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(participants);
		}
	});
};

exports.addRouteRef = function(workout, route, res, cb) {
	var query = {
		_id: workout._id
	};

	var update = {
		$set: {
			lastUpdate: new Date(),
			routeId: route._id
		}
	};

	var options = {};

	Workout.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};