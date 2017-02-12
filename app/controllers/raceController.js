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

exports.extractCriteria = function(req, res, next) {

  var operation = {
    fulltext: {},
    departments: {},
    types: {},
    date: {},
    page: 0,
    size: 20,
    sort: {
      "date": 1
    }
  };

  var criteria = req.body.criteria;

  if (criteria) {

    if (criteria.page) {
      operation.page = criteria.page;
    }

    if (criteria.size) {
      operation.size = criteria.size;
    }

    if (criteria.sort) {
      operation.sort = {
        "date": 1
      };
    }

    if (criteria.types.length > 0) {
      operation.types = {
        "type.name": {
          '$in': criteria.types
        }
      };
    }
    if (criteria.departments.length > 0) {
      operation.departments = {
        "department.code": {
          '$in': criteria.departments
        }
      };
    }

    if(criteria.fulltext) {
      var regex = new RegExp('\\b' + criteria.fulltext , 'i');
      operation.fulltext =  {
        "name": regex
      }
    }


    if (criteria.dateRange && criteria.dateRange.startDate && criteria.dateRange.endDate) {
      operation.date = {
        "date": {
          $gte: new Date(criteria.dateRange.startDate),
          $lt: new Date(criteria.dateRange.endDate)
        }
      };
    }
  }
  
  req.operation = operation;
  req.races = [];
  req.facets = [];

  return next();
};

/**
 * @method Get type facets
 * @param req
 * @param res
 */
exports.typeFacets = function(req, res) {

  Race.typeFacets(req.operation, function(err, typeFacets) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    req.facets.push(typeFacets);

    return res.json(200, {
      races: req.races,
      facets: req.facets
    });
  });

};

/**
 * @method Get department facets
 * @param req
 * @param res
 */
exports.departmentFacets = function(req, res, next) {

  Race.departmentFacets(req.operation, function(err, departmentFacets) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    req.facets.push(departmentFacets);
    return next();
  });

};

/**
 * @method Get date facets
 * @param req
 * @param res
 */
exports.dateFacets = function(req, res, next) {

  Race.dateFacets(req.operation, function(err, datefacets) {
    if (err) {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    req.facets.push(datefacets);
    return next();
  });

};

/**
 * @method Search races by criteria
 * @param req
 * @param res
 */
exports.search = function(req, res, next) {

  console.log(util.inspect(req.operation, true));

  Race.search(req.operation, function(err, races) {
    if (err) {
      console.log(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    req.races = races;
    return next();
  });
};

/**
 * @method Autocomplete
 * @param req
 * @param res
 */
exports.autocomplete = function(req, res) {

  Race.autocomplete(req.params.query_string, function(err, races) {
    if (err) {
      console.log(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    req.races = races;
     return res.json(200, {
      races: req.races
    });
  });
};