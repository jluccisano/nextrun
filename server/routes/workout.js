var workoutController = require("../controllers/workoutController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [{
    path: "/:id",
    httpMethod: "GET",
    middleware: [workoutController.getWorkout],
    accessLevel: accessLevels.public
}, {
    path: "/new",
    httpMethod: "POST",
    middleware: [workoutController.createWorkout],
    accessLevel: accessLevels.user
}, {
    path: "/:id/delete",
    httpMethod: "DELETE",
    middleware: [workoutController.deleteWorkout],
    accessLevel: accessLevels.user
}, {
    path: "/:id/update",
    httpMethod: "PUT",
    middleware: [workoutController.updateWorkout],
    accessLevel: accessLevels.user
}, {
    path: "/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [workoutController.getWorkouts],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [workoutController.getWorkoutsByUser],
    accessLevel: accessLevels.user
},/* {
    path: "/:id/participants/:participantId/join",
    httpMethod: "PUT",
    middleware: [workoutController.getOwner, workoutController.joinWorkout],
    accessLevel: accessLevels.public

}, {
    path: "/:id/participants/:participantId/unjoin",
    httpMethod: "PUT",
    middleware: [workoutController.getOwner, workoutController.unjoinWorkout],
    accessLevel: accessLevels.public

},*/{
    path: "/:id/participants/:participantId/update",
    httpMethod: "PUT",
    middleware: [workoutController.getOwner, workoutController.updateParticipant],
    accessLevel: accessLevels.public

}, {
    path: "/:id/participants/new",
    httpMethod: "PUT",
    middleware: [workoutController.checkIfParticipantAlreadyExists, workoutController.addParticipant, workoutController.getNewParticipant],
    accessLevel: accessLevels.user

}, {
    path: "/:id/participants/:participantId/delete",
    httpMethod: "DELETE",
    middleware: [workoutController.deleteParticipant],
    accessLevel: accessLevels.user

}, {
    path: "/:id/participants/available",
    httpMethod: "POST",
    middleware: [workoutController.checkIfParticipantAvailable],
    accessLevel: accessLevels.public
}, ];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", workoutController.loadWorkout);
    routerService.register(app, router, routes, "/api/workouts");
};