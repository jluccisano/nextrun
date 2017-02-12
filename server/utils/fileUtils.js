var errorUtils = require("./errorUtils"),
    underscore = require("underscore"),
    logger = require("../logger"),
    crypto = require("crypto"),
    fs = require("fs");

var authorizedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", ".csv", "text/plain", "text/html"];

var authorizedImageTypes = ["image/jpeg", "image/png"];

exports.checkIfAuthorizedFileType = function(type) {
    return (underscore.indexOf(authorizedFileTypes, type) > -1);
};

exports.checkIfAuthorizedImageType = function(type) {
    return (underscore.indexOf(authorizedImageTypes, type) > -1);
};

exports.decodeBase64 = function(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+.   \/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");

    return response;
};

exports.createTemporaryFile = function(path, data) {

    fs.writeFile(path, data, function(error) {
        if (error) {
            logger.error(error);
        }
    });
};

exports.deleteTemporaryFile = function(path) {

    fs.unlink(path, function(error) {
        if (error) {
            logger.error(error);
            throw error;
        }
        logger.info("successfully deleted" + path);
    });
};