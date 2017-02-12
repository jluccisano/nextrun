var raceService = require("../services/raceService"),
	fileUtils = require("../utils/fileUtils"),
	errorUtils = require("../utils/errorUtils"),
	crypto = require("crypto");

exports.createRace = function(req, res) {
	var race = req.body;
	raceService.save(race, req, res, function(newRace) {
		res.status(200).json({
			id: newRace._id
		});
	});
};

exports.getRace = function(req, res) {
	raceService.getRace(req, res, function(race) {
		res.status(200).json(race);
	});
};

exports.loadRace = function(req, res, next, id) {
	raceService.findRace(id, res, function(race) {
		req.race = race;
		next();
	});
};

exports.getRacesByUser = function(req, res) {
	raceService.getRacesByUser(req, res, function(races) {
		res.status(200).json({
			items: races
		});
	});
};

exports.getRaces = function(req, res) {
	raceService.getRaces(req, res, function(races) {
		res.status(200).json({
			items: races
		});
	});
};

exports.deleteRace = function(req, res) {
	var race = req.race;
	raceService.deleteRace(race, res, function() {
		res.sendStatus(200);
	});
};

exports.publishRace = function(req, res) {
	var race = req.race;
	raceService.publishRace(race, true, res, function() {
		res.sendStatus(200);
	});
};

exports.unpublishRace = function(req, res) {
	var race = req.race;
	raceService.publishRace(race, false, res, function() {
		res.sendStatus(200);
	});
};

exports.autocomplete = function(req, res) {
	var text = req.body.text;
	raceService.autocomplete(text, res, function(items) {
		res.status(200).json({
			items: items
		});
	});
};

exports.search = function(req, res) {
	var criteria = req.body.criteria;
	raceService.search(criteria, res, function(items) {
		res.status(200).json({
			items: items
		});
	});
};

exports.checkIfRaceNameAvailable = function(req, res) {
	var name = req.body.name;
	var race = req.race;
	raceService.checkIfRaceNameAvailable(name, race, res, function(items) {
		res.status(200).json({
			items: items
		});
	});
};

exports.checkIfRaceNameAlreadyExists = function(req, res, next) {
	var name = req.body.fields.name;
	var race = req.race;
	if (name) {
		raceService.checkIfRaceNameAlreadyExists(name, race, res, function() {
			next();
		});
	} else {
		next();
	}
};

exports.updateRouteRef = function(req, res, next) {
	var route = req.routeData;
	raceService.updateRouteRef(route, res, function() {
		next();
	});
};

exports.addRouteRef = function(req, res) {
	var race = req.race;
	var route = req.routeData;
	raceService.addRouteRef(race, route, res, function() {
		res.sendStatus(200);
	});
};

exports.deleteRacesOfUser = function(req, res, next) {
	var user = req.user;
	raceService.deleteRacesOfUser(user, res, function() {
		next();
	});
};

exports.updateRace = function(req, res) {
	var race = req.race;
	raceService.updateRace(race, req, res, function() {
		res.status(200).json({
			id: race._id
		});
	});
};



exports.uploadPicture = function(req, res) {
	var race = req.race;
	var imageFile = req.body;

	if (fileUtils.checkIfAuthorizedImageType(imageFile.type)) {

		var imageBuffer = fileUtils.decodeBase64(imageFile.data);

		var tmpFileName = crypto.randomBytes(4).readUInt32LE(0) + "_" + imageFile.name;
		var tmpFilePath = "./.tmp/" + tmpFileName;

		fileUtils.createTemporaryFile(tmpFilePath, imageBuffer.data);

		raceService.uploadPicture(race, tmpFilePath, tmpFileName, res, function() {
			res.status(200).json({
				id: race._id
			});
		});

	} else {
		errorUtils.handleFileTypeNotAuthorized(res);
	}
};

exports.uploadRights = function(req, res) {
	var path = req.files.file.path;
	var race = req.race;
	var originalName = req.files.file.originalname;

	raceService.uploadRights(race, path, originalName, res, function() {
		res.status(200).json({
			id: race._id
		});
	});
};

exports.downloadPicture = function(req, res) {
	var race = req.race;
	raceService.downloadPicture(race, res, function(data) {
		res.status(200).send(data);
	});
};

exports.deletePicture = function(req, res, next) {
	var race = req.race;
	raceService.deletePicture(race, res, function() {
		next();
	});
};

exports.deleteRightsFile = function(req, res, next) {
	var race = req.race;
	raceService.deleteRightsFile(race, res, function() {
		next();
	});
};


exports.loadResult = function(req, res, next, resultId) {
	raceService.findResult(resultId, res, function(result) {
		req.result = result;
		next();
	});
};


exports.addResult = function(req, res) {
	var race = req.race;
	var result = req.body;

	if (fileUtils.checkIfAuthorizedFileType(result.file.type)) {

		var imageBuffer = fileUtils.decodeBase64(result.file.data);

		var tmpFileName = crypto.randomBytes(4).readUInt32LE(0) + "_" + result.file.name;
		var tmpFilePath = "./.tmp/" + tmpFileName;

		var name = result.name;
		var filename = result.file.name;
		var year = result.year;

		fileUtils.createTemporaryFile(tmpFilePath, imageBuffer.data);

		raceService.addResult(race, tmpFilePath, name, filename, year, res, function() {
			res.status(200).json({
				id: race._id
			});
		});
	} else {
		errorUtils.handleFileTypeNotAuthorized(res);
	}
};


exports.deleteResultFile = function(req, res, next) {
	var result = req.result;
	raceService.deleteResultFile(result, res, function() {
		next();
	});
};

exports.deleteResult = function(req, res) {
	var race = req.race;
	var result = req.result;
	raceService.deleteResult(race, result, res, function() {
		res.sendStatus(200);
	});
};

exports.getResult = function(req, res) {
	var race = req.race;
	var result = req.result;
	raceService.getResult(race, result, res, function(data) {
		res.status(200).send(data);
	});
};