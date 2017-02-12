var workoutService = require("../services/workoutService"),
    userService = require("../services/userService"),
    underscore = require("underscore"),
    email = require("../middlewares/notification");



exports.loadWorkout = function(req, res, next, id) {
    workoutService.findWorkout(id, res, function(workout) {
        req.workout = workout;
        next();
    });
};

exports.getWorkout = function(req, res) {
    workoutService.getWorkout(req, res, function(workout) {
        res.status(200).json(workout);
    });
};

exports.createWorkout = function(req, res) {
    var workout = req.body;
    var user = req.user;
    workoutService.save(workout, req, res, function(newWorkout) {
        underscore.forEach(newWorkout.participants, function(participant) {
            email.sendNotificationToParticipant(newWorkout, user, participant);
        });

        res.status(200).json({
            id: newWorkout._id
        });
    });
};

exports.updateWorkout = function(req, res) {
    var workout = req.workout;
    workoutService.updateWorkout(workout, req, res, function() {
        res.status(200).json({
            id: workout._id
        });
    });
};

exports.deleteWorkout = function(req, res) {
    var workout = req.workout;
    workoutService.deleteWorkout(workout, res, function() {
        res.sendStatus(200);
    });
};

exports.getWorkouts = function(req, res) {
    workoutService.getWorkouts(req, res, function(workouts) {
        res.status(200).json({
            items: workouts
        });
    });
};

exports.getWorkoutsByUser = function(req, res) {
    workoutService.getWorkoutsByUser(req, res, function(workouts) {
        res.status(200).json({
            items: workouts
        });
    });
};

exports.joinWorkout = function(req, res) {
    var workout = req.workout;
    var participantId = req.params.participantId;
    var workoutOwner = req.workoutOwner;
    workoutService.joinWorkout(workout, participantId, true, res, function() {
        email.sendNotificationToOwner(workout, workoutOwner, participantId);
        res.sendStatus(200);
    });
};

exports.unjoinWorkout = function(req, res) {
    var workout = req.workout;
    var participantId = req.params.participantId;
    var workoutOwner = req.workoutOwner;
    workoutService.joinWorkout(workout, participantId, false, res, function() {
        email.sendNotificationToOwner(workout, workoutOwner, participantId);
        res.sendStatus(200);
    });
};

exports.addParticipant = function(req, res, next) {
    var workout = req.workout;
    var participant = req.body;
    var user = req.user;
    workoutService.addParticipant(workout, participant, res, function() {
        next();
    });
};

exports.getNewParticipant = function(req, res) {
    var workout = req.workout;
    var participant = req.body;
    var user = req.user;
    workoutService.findParticipant(workout, participant, res, function(newParticipant) {
        email.sendNotificationToParticipant(workout, user, newParticipant);
        res.sendStatus(200);
    });
};

exports.deleteParticipant = function(req, res, next) {
    var workout = req.workout;
    var participantId = req.params.participantId;
    workoutService.deleteParticipant(workout, participantId, res, function() {
        res.sendStatus(200);
    });
};

exports.getOwner = function(req, res, next) {
    var workout = req.workout;
    userService.findUserById(workout.ownerId, res, function(workoutOwner) {
        req.workoutOwner = workoutOwner;
        next();
    });
};

exports.checkIfParticipantAlreadyExists = function(req, res, next) {
    var participant = req.body;
    var workout = req.workout;
    if (participant) {
        workoutService.checkIfParticipantAlreadyExists(participant, workout, res, function() {
            next();
        });
    } else {
        next();
    }
};

exports.checkIfParticipantAvailable = function(req, res) {
    var participantEmail = req.body.email;
    var workout = req.workout;
    workoutService.checkIfParticipantAvailable(participantEmail, workout, res, function(items) {
        res.status(200).json({
            items: items
        });
    });
};