var GridFs = require("gridfs-stream"),
	errorUtils = require("../utils/errorUtils"),
	logger = require("../logger"),
	mongoose = require("mongoose"),
	fs = require("fs");

GridFs.mongo = mongoose.mongo;

var gridfs;

mongoose.connection.once("open", function() {
	gridfs = new GridFs(mongoose.connection.db);
});

exports.storeFile = function(path, originalName, cb) {
	var writestream = gridfs.createWriteStream({
		filename: originalName
	});

	fs.createReadStream(path).pipe(writestream);

	writestream.on("close", function(file) {
		cb(file);
	});

	fs.unlink(path, function(error) {
		if (error) {
			logger.error(error);
			throw error;
		}
		logger.info("successfully deleted"+path);
	});
};

exports.getFile = function(id, res, cb) {
	var options = {
		_id: id
	};
	gridfs.exist(options, function(error, exist) {
		if (error) {
			return errorUtils.handleError(res, error);
		}
		var bufs = [];
		if (exist) {
			logger.info("File exists");

			var readstream = gridfs.createReadStream({
				_id: id
			});
			readstream.on("data", function(chunk) {
				bufs.push(chunk);
			}).on("end", function() {
				cb(bufs);
			});
			//cb(readstream);
		} else {
			logger.info("File does not exist");
			cb(bufs);
		}
	});
};

exports.deleteFile = function(id, res, cb) {

	var options = {
		_id: id
	};

	gridfs.exist(options, function(error, exist) {
		if (error) {
			return errorUtils.handleError(res, error);
		}
		if (exist) {
			logger.info("File exists");

			gridfs.remove(options, function(error) {
				if (error) {
					return errorUtils.handleError(res, error);
				}
				logger.debug("file deleted successfully");
				cb();
			});
		} else {
			logger.info("File does not exist");
			cb();
		}
	});
};