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
        email.sendNewWorkout(user, newWorkout);
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
    var user = req.user;
    workoutService.updateWorkout(workout, req, res, function() {

        underscore.forEach(workout.participants, function(participant) {
            email.sendNotificationUpdateToParticipant(workout, user, participant);
        });

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
    workoutService.getWorkouts(req, res, function(data) {
        res.status(200).json(data);
    });
};

exports.getWorkoutsByUser = function(req, res) {
    workoutService.getWorkoutsByUser(req, res, function(data) {
        res.status(200).json(data);
    });
};

exports.updateParticipant = function(req, res) {
    var workout = req.workout;
    var participantId = req.params.participantId;
    var participant = req.body;
    var workoutOwner = req.workoutOwner;
    workoutService.updateParticipant(workout,participant, req, res, function() {
        email.sendNotificationToOwner(workout, workoutOwner, participant);
        res.sendStatus(200);
    });
};

exports.addParticipant = function(req, res, next) {
    var workout = req.workout;
    var participant = req.body;
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

exports.deleteParticipant = function(req, res) {
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

exports.addRouteRef = function(req, res) {
    var workout = req.workout;
    var route = req.routeData;
    workoutService.addRouteRef(workout, route, res, function() {
        res.sendStatus(200);
    });
};

exports.updateRouteRef = function(req, res, next) {
    var route = req.routeData;
    workoutService.updateRouteRef(route, res, function() {
        next();
    });
};

exports.unlinkRouteRef = function(req, res, next) {
    var route = req.routeData;
    workoutService.updateRouteRef(route, res, function() {
        res.sendStatus(200);
    });
};