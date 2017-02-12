/**
 * @module Race Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
    Race = mongoose.model("Race"),
    errorUtils = require("../utils/errorUtils"),
    underscore = require("underscore"),
    logger = require("../logger");


exports.checkAuthorization = function(req, res, next) {

    var race = req.race;
    var userConnected = req.user;

    if (!underscore.isUndefined(race) && !underscore.isUndefined(race.userId) && !underscore.isUndefined(race._id)) {

        if (!underscore.isUndefined(userConnected) && !underscore.isUndefined(userConnected._id)) {

            if (race.userId.equals(userConnected._id)) {

                next();

            } else {
                logger.error("error.userNotOwner");
                return res.status(400).json({
                    message: ["error.userNotOwner"]
                });
            }
        } else {
            return res.status(400).json({
                message: ["error.userNotConnected"]
            });
        }
    } else {
        return res.status(400).json({
            message: ["error.unknownRace"]
        });
    }
};

/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {

    Race.load(id, function(err, race) {
        if (err) {
            logger.error(err);
            return res.status(400).json({
                message: ["error.unknownId"]
            });
        }
        if (!race) {
            logger.error("error.unknownId");
            return res.status(400).json({
                message: ["error.unknownId"]
            });
        }
        req.race = race;
        next();
    });
};

/**
 * @method create new race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.create = function(req, res) {

    var body = req.body;
    var userConnected = req.user;

    if (!underscore.isUndefined(body) && !underscore.isUndefined(body.race)) {

        if (!underscore.isUndefined(userConnected) && !underscore.isUndefined(userConnected._id)) {

            var race = new Race(req.body.race);
            race.lastUpdate = new Date();
            race.creationDate = new Date();
            race.userId = userConnected._id;

            if (race.place.location.latitude && race.place.location.longitude) {
                console.log(race.place.location);
                race.place.geo = {
                    type: "Point",
                    coordinates: [race.place.location.latitude, race.place.location.longitude]
                };  
            }

            console.log(race);

            race.save(function(err, race) {
                if (err) {
                    logger.error(err);
                    return res.status(400).json({
                        message: errorUtils.errors(err.errors)
                    });
                } else {
                    return res.status(200).json({
                        raceId: race._id
                    });
                }
            });
        } else {
            return res.status(400).json({
                message: ["error.userNotConnected"]
            });
        }
    } else {
        return res.status(400).json({
            message: ["error.bodyParamRequired"]
        });
    }
};

/**
 * @method find by user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.findByUser = function(req, res) {

    var criteria = {};
    var page = 1;
    var perPage = 10;

    criteria = {
        userId: req.user._id
    };

    if (typeof req.params.page !== "undefined") {
        page = req.params.page;
    }

    var options = {
        perPage: perPage,
        page: page - 1,
        criteria: criteria
    };

    Race.findByCriteria(options, function(err, races) {
        console.log(err);
        console.log(races);
        if (err) {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
        if (races) {
            return res.status(200).json({
                races: races
            });
        } else {
            logger.error("error.occured");
            return res.status(400).json({
                message: ["error.occured"]
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
    var race = req.race;

    if (!underscore.isUndefined(race)) {
        return res.status(200).json({
            race: race
        });
    } else {
        return res.status(400).json({
            message: ["error.unknownRace"]
        });
    }
};

exports.update = function(req, res) {

    var race = req.race;
    var fieldsToUpdate;

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.fields)) {

        fieldsToUpdate = req.body.fields;
        fieldsToUpdate.lastUpdate = new Date();

        var query = {};
        if (!underscore.isUndefined(req.body.query)) {
            query = req.body.query;
        }

        query._id = race._id;

        if(fieldsToUpdate.place) {
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
        }, function(err) {
            if (!err) {
                return res.sendStatus(200);
            } else {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }
        });
    } else {
        return res.status(400).json({
            message: ["error.bodyParamRequired"]
        });
    }
};

/**
 * @method delete race
 * @param req
 * @param res
 */
exports.delete = function(req, res) {

    var race = req.race;

    Race.destroy(race._id, function(err) {
        if (!err) {
            return res.sendStatus(200);
        } else {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
    });
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
    }, function(err) {
        if (!err) {
            return res.sendStatus(200);
        } else {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
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

    if (!underscore.isUndefined(user)) {
        Race.destroyAllRaceOfUser(req.user, function(err) {
            if (!err) {
                next();
            } else {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }
        });
    } else {
        return res.status(400).json({
            message: ["error.unknownUser"]
        });
    }


};

exports.search = function(req, res) {
    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.criteria)) {

        Race.search(req.body.criteria, function(err, items) {
            if (err) {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }
            if (items) {
                return res.status(200).json({
                    items: items
                });
            } else {
                logger.error("error.occured");
                return res.status(400).json({
                    message: ["error.occured"]
                });
            }
        });

    } else {
        return res.status(400).json({
            message: ["error.noCriteria"]
        });
    }
};

exports.autocomplete = function(req, res) {

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.text)) {

        Race.autocomplete(req.body.text, function(err, items) {
            if (err) {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }
            if (items) {
                return res.status(200).json({
                    items: items
                });
            } else {
                logger.error("error.occured");
                return res.status(400).json({
                    message: ["error.occured"]
                });
            }
        });

    } else {
        return res.status(400).json({
            message: ["error.noText"]
        });
    }

};

/**
 * @method Find all races
 * @param req
 * @param res
 * @return error 400 if database crash otherwise 200
 */
exports.findAll = function(req, res) {

    Race.findAll(function(err, races) {
        if (err) {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
        if (races) {
            return res.status(200).json({
                races: races
            });
        } else {
            return res.status(400).json({
                message: ["error.occured"]
            });
        }
    });
};