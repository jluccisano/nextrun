var errorUtils = require("./errorUtils"),
    underscore = require("underscore");


exports.load = function(req, res, next, id, model, modelName) {
    model.load(id, function(error, data) {
        if (error) {
            errorUtils.handleError(res, error);
        } else if (!data) {
            errorUtils.handleUnknownId(res);
        } else {
            req[modelName] = data;
            next();
        }
    });
};

exports.find = function(req, res, modelName) {
    var data = req[modelName];
    if (!underscore.isUndefined(data)) {
        res.status(200).json(data);
    } else {
        errorUtils.handleUnknownData(res);
    }
};

exports.save = function(req, res, model) {
    model.save(req, function(error, data) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                id: data._id
            });
        }
    });
};

exports.delete = function(req, res, id, model) {
    model.destroy(id, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.findByCriteria = function(req, res, id, model, options) {
    model.findByCriteria(options, function(error, items) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: items
            });
        }
    });
};