/**
 * @module Race Controller
 * @author jluccisano
 */

var mongoose = require('mongoose'),
  Race = mongoose.model('Race'),
  errorUtils = require('../utils/errorutils'),
  util = require('util'),
  ElasticSearchClient = require('elasticsearchclient');

var serverOptions = {
  host: 'localhost',
  port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

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
    fulltext: "*",
    departments: {},
    types: {},
    date: {},
    page: 0,
    size: 20,
    region: {},
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
      /*operation.sort = {
        "date": 1
      };*/
    }

    if (criteria.types.length > 0) {

      operation.types = criteria.types;
      /*operation.types = {
        "type.name": {
          '$in': criteria.types
        }
      };*/
    }
    if (criteria.departments.length > 0) {

       operation.departments = criteria.departments;

     /* operation.departments = {
        "department.code": {
          '$in': criteria.departments
        }
      };*/
    }

    if (criteria.region !== undefined) {
      /*operation.region = {
        "department.code": {
          '$in': criteria.region.departments
        }
      };*/
    }

    if (criteria.fulltext) {

      operation.fulltext = criteria.fulltext;
     /* var regex = new RegExp('\\b' + criteria.fulltext, 'i');
      operation.fulltext = {
        "name": regex
      }*/
    }


    if (criteria.dateRange && criteria.dateRange.startDate && criteria.dateRange.endDate) {
      /*operation.date = {
        "date": {
          $gte: new Date(criteria.dateRange.startDate),
          $lt: new Date(criteria.dateRange.endDate)
        }
      };*/
    }
  }

  req.operation = operation;
  req.races = [];
  req.facets = [];

  return next();
};

/**
 * @method Search races by criteria
 * @param req
 * @param res
 */
exports.search = function(req, res) {

  var operation = req.operation;

  //var search = "*";
  var page = 0;
  var pageSize = 20;
  var sort = "_score";
  var filters = "";
  var criteria = {};

  var fields = [
    "name",
    "distanceType",
    "type",
    "department",
    "_id"
  ];

  var type_filter = {};
  var department_filter = {};

  //query

  var query = {};

  query.bool = {};
  query.bool.should = [];
  query.bool.should.push(buildQueryString("race.name.autocomplete", operation.fulltext));
  query.bool.should.push(buildQueryString("race.department.name.autocomplete",  operation.fulltext));
  query.bool.should.push(buildQueryString("race.department.region.autocomplete",  operation.fulltext));
  query.bool.should.push(buildQueryString("race.department.code.autocompletee",  operation.fulltext));
  query.bool.should.push(buildQueryString("race.distanceType.i18n.autocomplete",  operation.fulltext));
  query.bool.should.push(buildQueryString("race.type.name.autocomplete",  operation.fulltext));

  criteria.query = query;

  //filter

  var filter = {};
  filter.and = [];

  var typesArray = [];

  if (operation.types) {
    typesArray = operation.types;

    type_filter = {
      "terms": {
        "race.type.name": typesArray
      }
    };

    filter.and.push(type_filter);
  }

  var departmentsArray = [];

  if (operation.departments) {
    departmentsArray = operation.departments;

    department_filter = {
      "terms": {
        "race.department.code": departmentsArray
      }
    };

    filter.and.push(department_filter);
  }



  if (filter.and.length > 0) {
    criteria.filter = filter;
  }



  //facets

  var facets = {
    "departmentFacets": {
      "terms": {
        "field": "race.department.code",
        "order": "term",
        "all_terms": true
      }
    },
    "typeFacets": {
      "terms": {
        "field": "race.type.name",
        "order": "term",
        "all_terms": true
      }
    }
  };

  var departmentFacetFilter = {}
  departmentFacetFilter.and = [];
  var typeFacetFilter = {}
  typeFacetFilter.and = [];

  if (departmentsArray.length > 0) {
    typeFacetFilter.and.push(department_filter);
  }

  if (typesArray.length > 0) {
    departmentFacetFilter.and.push(type_filter);
  }

  if (typeFacetFilter.and.length > 0) {
    facets.typeFacets.facet_filter = typeFacetFilter;
  }

  if (departmentFacetFilter.and.length > 0) {
    facets.departmentFacets.facet_filter = departmentFacetFilter;
  }

  criteria.facets = facets;


  criteria.from = page;
  criteria.size = pageSize;
  criteria.fields = fields;
  criteria.sort = [sort];

  console.log(util.inspect(criteria));

  elasticSearchClient.search('racesidx_v1', 'race', criteria)
    .on('data', function(data) {
      console.log(JSON.parse(data));
      res.json(200, JSON.parse(data));
    })
    .on('done', function() {})
    .on('error', function(err) {
      console.log(err)
      res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    })
    .exec();
};

/**
 * @method Autocomplete
 * @param req
 * @param res
 */
exports.autocomplete = function(req, res) {

  var criteria = req.body.criteria;

  var query = {
    "fields": [
      "name",
      "distanceType",
      "type",
      "department",
      "_id"
    ],
    "query": {
      "bool": {
        "should": [{
            "query_string": {
              "default_field": "race.name.autocomplete",
              "query": criteria.fulltext
            }
          }, {
            "query_string": {
              "default_field": "race.department.name.autocomplete",
              "query": criteria.fulltext
            }
          }, {
            "query_string": {
              "default_field": "race.department.region.autocomplete",
              "query": criteria.fulltext
            }
          }, {
            "query_string": {
              "default_field": "race.department.code.autocomplete",
              "query": criteria.fulltext
            }
          }, {
            "query_string": {
              "default_field": "race.distanceType.i18n.autocomplete",
              "query": criteria.fulltext
            }
          }, {
            "query_string": {
              "default_field": "race.type.name.autocomplete",
              "query": criteria.fulltext
            }
          },

        ]
      }
    },
    "from": 0,
    "size": 8,
    "sort": [],
    "filter": {
      "and": [{
        "term": {
          "race.published": true
        }
      }]

    }
  };

  if (criteria.region !== undefined) {

    query.filter.and.push({
      "terms": {
        "race.department.code": criteria.region.departments
      }
    });
  }

  console.log("JSON.parse(data)");

  elasticSearchClient.search('racesidx_v1', 'race', query)
    .on('data', function(data) {
      console.log(JSON.parse(data));
      res.json(200, JSON.parse(data));
    })
    .on('done', function() {
      //always returns 0 right now
    })
    .on('error', function(err) {
      console.log(err);
      res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    })
    .exec();
};

buildQueryString = function(field, query) {

  var result = {}
  result.queryString = {};

  result.queryString.default_field = field;
  result.queryString.query = query;

  return result;
}