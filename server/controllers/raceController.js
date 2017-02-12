/**
 * @module Race Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
    Race = mongoose.model("Race"),
    errorUtils = require("../utils/errorUtils"),
    mongooseUtils = require("../utils/mongooseUtils"),
    underscore = require("underscore");

/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {
    mongooseUtils.load(req, res, next, id, Race, "race");
    /*Race.load(id, function(error, race) {
        if (error) {
            errorUtils.handleError(res, error);
        } else if (!race) {
            errorUtils.handleUnknownId(res);
        } else {
            req.race = race;
            next();
        }
    });*/
};


/**
 * @method create new race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.create = function(req, res) {
    var race = new Race(req.body.race);
    mongooseUtils.save(req, res, race);

    /*var race = new Race(req.body.race);
    var userConnected = req.user;

    //move to model
    race.userId = userConnected._id;

    //move to model
    if (race.place.location.latitude && race.place.location.longitude) {
        race.place.geo = {
            type: "Point",
            coordinates: [race.place.location.latitude, race.place.location.longitude]
        };
    }

    race.save(function(error, race) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                raceId: race._id
            });
        }
    });*/
};

/**
 * @method find by user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.findByUser = function(req, res) {
    var page = 1;
    var perPage = 10;
    var criteria = {
        userId: req.user._id
    };

    if (req.params.page) {
        page = req.params.page;
    }

    var options = {
        perPage: perPage,
        page: page - 1,
        criteria: criteria
    };

    Race.findByCriteria(options, function(error, races) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: races
            });
        }
    });
};


/**
 * @method find race
 * @param req
 * @param res
 * @returns race loaded by load parameter id
 */
exports.find = function(req, res) {
    mongooseUtils.find(req,res,"race");
    /*var race = req.race;
    if (!underscore.isUndefined(race)) {
        res.status(200).json(race);
    } else {
        errorUtils.handleUnknownData(res);
    }*/
};


exports.update = function(req, res) {
    var race = req.race;
    var fieldsToUpdate;

    fieldsToUpdate = req.body.fields;
    fieldsToUpdate.lastUpdate = new Date();

    var query = {};
    if (!underscore.isUndefined(req.body.query)) {
        query = req.body.query;
    }

    query._id = race._id;

    if (fieldsToUpdate.place) {
        if (fieldsToUpdate.place.location.latitude && fieldsToUpdate.place.location.longitude) {
            console.log(fieldsToUpdate.place.location);
            fieldsToUpdate.place.geo = {
                type: "Point",
                coordinates: [race.place.location.latitude, race.place.location.longitude]
            };
        }
    }

    Race.update(query, {
        $set: fieldsToUpdate
    }, {
        upsert: true
    }, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                raceId: race._id
            });
        }
    });
};

exports.updateRoute = function(req, res) {
    var race = req.race;
    var route = req.routeData;
    console.log(race);
    console.log(route);
    Race.update({
        _id: race._id
    }, {
        $set: {
            lastUpdate: new Date()
        },
        $addToSet: {
            routes: route._id
        }
    }, {}, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * @method delete race
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    var race = req.race;
    mongooseUtils.delete(req, res, race._id, Race);
    /*Race.destroy(race._id, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });*/
};


/**
 * @method publish the race
 * @param req
 * @param res
 */
exports.publish = function(req, res) {
    var race = req.race;
    var value = false;

    if (!underscore.isUndefined(req.params) && !underscore.isUndefined(req.params.value)) {
        value = req.params.value;
    }

    Race.update({
        _id: race._id
    }, {
        $set: {
            lastUpdate: new Date(),
            published: value,
            publicationDate: new Date()
        }
    }, {
        upsert: true
    }, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * @method Delete all race of user
 * This function is used when a user delete his own account
 * @param req
 * @param res
 * @param next
 */
exports.destroyAllRaceOfUser = function(req, res, next) {
    var user = req.user;
    Race.destroyAllRaceOfUser(user, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            next();
        }
    });
};

exports.search = function(req, res) {
    Race.search(req.body.criteria, function(error, items) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: items
            });
        }
    });
};

exports.autocomplete = function(req, res) {
    Race.autocomplete(req.body.text, function(error, items) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: items
            });
        }
    });
};



/**
 * @method Find all races
 * @param req
 * @param res
 * @return error 400 if database crash otherwise 200
 */
exports.findAll = function(req, res) {
    Race.findAll(function(error, items) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: items
            });
        }
    });
};

exports.updateRoutesRef = function(req, res, next) {
    var route = req.routeData;
    console.log(route);
    Race.update({}, {
        $pull: {
            routes: route._id,
        }
    }, {
        multi: true
    }, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            next();
        }
    });
};