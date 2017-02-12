/**
 * @module Race Controller
 * @author jluccisano
 */

var mongoose = require('mongoose'),
  Race = mongoose.model('Race'),
  errorUtils = require('../utils/errorutils'),
  util = require('util');


/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {
  Race.load(id, function(err, race) {
    if (err) {
      return res.json(400, {
        message: ["error.unknownId"]
      });
    }
    if (!race) {
      return res.json(400, {
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
  var race = new Race(req.body.race);
  race.last_update = new Date();
  race.created_date = new Date();
  race.user_id = req.user._id;

  race.save(function(err,race) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    } else {
      return res.json(200,{raceId: race._id});
    }

  });
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
    user_id: req.user._id
  };

  if (req.params.page) {
    page = req.params.page;
  }

  var options = {
    perPage: perPage,
    page: page - 1,
    criteria: criteria
  }

  Race.findByCriteria(options, function(err, races) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    return res.json(200, {
      races: races
    });
  });
};


/**
 * @method find race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.find = function(req, res) {
  return res.json(200, {
    race: req.race
  });
};

/**
 * @method update race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.update = function(req, res) {

  var race = req.race;

  if (race.user_id.equals(req.user._id)) {

    var raceToUpdate = req.body.race;
    raceToUpdate.last_update = new Date();

    delete raceToUpdate._id;

    Race.update({
      _id: race._id
    }, {
      $set: raceToUpdate
    }, {
      upsert: true
    }, function(err) {
      if (!err) {
        return res.json(200);
      } else {
        console.log(err);
        return res.json(400, {
          message: errorUtils.errors(err.errors)
        });
      }
    });
  } else {
    return res.json(400, {
      message: ["error.userNotOwner"]
    });
  }
};

/**
 * @method delete race
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
  if (req.race.user_id.equals(req.user._id)) {
    Race.destroy(req.race._id, function(err) {
      if (!err) {
        return res.json(200);
      } else {
        return res.json(400, {
          message: errorUtils.errors(err.errors)
        });
      }
    });
  } else {
    return res.json(400, {
      message: ["error.userNotOwner"]
    });
  }
};