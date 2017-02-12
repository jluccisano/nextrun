var raceService = require("../services/raceService"),
	logger = require("../logger"),
	fs = require("fs");

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

	var decodeBase64Image = function(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
			response = {};

		if (matches.length !== 3) {
			return new Error("Invalid input string");
		}

		response.type = matches[1];
		response.data = new Buffer(matches[2], "base64");

		return response;
	};

	//var path = req.files.file.path;
	var race = req.race;
	//var originalName = req.files.file.originalname;

	var imageBuffer = decodeBase64Image(req.body.base64);

	fs.writeFile("./.tmp/tmpImg.jpg", imageBuffer.data, function(error) {
		if(error) {
			logger.error(error);
		}
	});


	raceService.uploadPicture(race, "./.tmp/tmpImg.jpg", "test.jpg", res, function() {
		res.status(200).json({
			id: race._id
		});
	});
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

	var decodeBase64 = function(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
			response = {};

		if (matches.length !== 3) {
			return new Error("Invalid input string");
		}

		response.type = matches[1];
		response.data = new Buffer(matches[2], "base64");

		return response;
	};

	var imageBuffer = decodeBase64(result.file);

	var path = "./.tmp/" + result.name;
	var filename = result.name;
	var year = result.year;

	fs.writeFile(path, imageBuffer.data, function(err) {
		console.log(err);
	});

	raceService.addResult(race, path, filename, year, res, function() {
		res.status(200).json({
			id: race._id
		});
	});
};


exports.deleteResultFile = function(req, res, next) {
	var result = req.result;
	raceService.deleteResultFile(result , res, function() {
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
		//res.header('content-type','binary/octet-stream');
		//res.set('Content-Type', 'application/json');
        //readstream.pipe(res);

	});
};