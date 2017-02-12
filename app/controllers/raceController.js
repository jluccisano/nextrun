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

  race.save(function(err, race) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    } else {
      return res.json(200, {
        raceId: race._id
      });
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

/**
 * @method update LatLng of event address
 * @param req
 * @param res
 */
exports.updateLatLng = function(raceId, latlng) {
  Race.update({
    _id: raceId
  }, {
    $set: {
      "plan.address.latlng": latlng
    }
  }, {
    upsert: true
  }, function(err) {
    if (err) {
      console.log("error during try to update latlng for: " + raceId + " , details: " + err);
    } else {
      console.log("latlng updated for: " + raceId);
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

  if (req.params.value) {
    value = req.params.value
  }

  if (race.user_id.equals(req.user._id)) {

    Race.update({
      _id: race._id
    }, {
      $set: {
        last_update: new Date(),
        published: value,
        publication_date: new Date()
      }
    }, {
      upsert: true
    }, function(err) {
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

/**
 * @method Delete all race of user
 * This function is used when a user delete his own account
 * @param req
 * @param res
 * @param next
 */
exports.destroyAllRaceOfUser = function(req, res, next) {

  Race.destroyAllRaceOfUser(req.user, function(err) {
    if (!err) {
      next();
    } else {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
  });

};

/**
 * @method Get facets
 * @param req
 * @param res
 */
exports.facets = function(req, res) {

  var operation = {
    department: {},
    type: {},
    date: {}
  };

  Race.facets(operation, function(err, facets) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    return res.json(200, {
      races: req.races,
      facets: facets
    });
  });

};

/**
 * @method Search races by criteria
 * @param req
 * @param res
 */
exports.search = function(req, res, next) {

  var operation = {
    department: {},
    type: {},
    date: {}
  };

  var from = 0;
  var to = 0;

  if (req.param('from')) {
    from = new Date(parseInt(req.param('from'), 10));
  }

  if (req.param('to')) {
    to = new Date(parseInt(req.param('to'), 10));
  }

  if (from && to) {
    operation.date = {
      "date": {
        $gte: from,
        $lt: to
      }
    };
  } else if (from) {
    operation.date = {
      "date": {
        $gte: from
      }
    };
  } else if (to) {
    operation.date = {
      "date": {
        $lt: to
      }
    };
  }


  var types = req.param('type')
  if (types) {
    var typesArray = types.split(',');
    operation.type = {
      "type": {
        '$in': typesArray
      }
    };
  }
  var departments = req.param('department');
  if (departments) {
    var departmentsArray = departments.split(',');
    console.log(departmentsArray);
    operation.department = {
      "department.code": {
        '$in': departmentsArray
      }
    };
  }

  console.log(util.inspect(operation, true));

  Race.search(operation, function(err, races) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    console.log(races);
    req.races = races;
    return next();
  });


};