var GridFs = require('gridfs-stream'),
	logger = require("../logger"),
	mongoose = require("mongoose"),
	fs = require("fs");

GridFs.mongo = mongoose.mongo;

var gridfs;

mongoose.connection.once('open', function() {
	gridfs = GridFs(mongoose.connection.db);
	console.log("gridfs loaded" + gridfs);
});

exports.storeFile = function(path, originalName, cb) {
	var writestream = gridfs.createWriteStream({
		filename: originalName
	});

	fs.createReadStream(path).pipe(writestream);

	writestream.on('close', function(file) {
		cb(file);
	});
};

exports.getFile = function(id, res, cb) {
	var options = {
		_id: id
	};
	gridfs.exist(options, function(error, exist) {
		if (error) return errorUtils.handleError(res, error);
		exist ? logger.info('File exists') : logger.info('File does not exist');

		var bufs = [];
		if (exist) {
			var readstream = gridfs.createReadStream({
				_id: id
			});
			readstream.on('data', function(chunk) {
				bufs.push(chunk);
			}).on('end', function() {
				cb(bufs);
			});
		} else {
			cb(bufs);
		}
	});
};

exports.deleteFile = function(id, res, cb) {

	var options = {
		_id: id
	};

	gridfs.exist(options, function(error, exist) {
		if (error) return errorUtils.handleError(res, error);
		exist ? logger.info('File exists') : logger.info('File does not exist');

		if (exist) {
			gridfs.remove(options, function(error) {
				if (error) return errorUtils.handleError(res, error);
				logger.debug("file deleted successfully");
				cb();
			});
		} else {
			cb();
		}
	});
};