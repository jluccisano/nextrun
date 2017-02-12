/**
 * @module Race Controller
 * @author jluccisano
 */

var mongoose = require('mongoose'),
  Race = mongoose.model('Race'),
  errorUtils = require('../utils/errorutils'),
  util = require('util'),
  elasticsearchUtils = require('../utils/elasticsearchUtils'),
  ElasticSearchClient = require('elasticsearchclient'),
  fs = require('fs');

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
      console.log(err);
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
 * @method Search races by criteria
 * @param req
 * @param res
 */
exports.search = function(req, res) {

  var criteria = req.body.criteria;

  if (process.env.NODE_ENV === 'development') {
    console.log(util.inspect(criteria, true, 7, true));
  }

  var operation = {
    from: 0,
    size: 20,
    sort: "_score"
  };

  var partial_fields = {
    "partial1": {
      "exclude": "routes.*"
    }
  };

  //query

  var query = {};

  query.bool = {};
  query.bool.should = [];

  if ('undefined' !== typeof(criteria.fulltext) && criteria.fulltext.length > 2) {

    var raceName_query = elasticsearchUtils.buildQueryString("race.name.autocomplete", criteria.fulltext);

    if (raceName_query) {
      query.bool.should.push(raceName_query);
    }

    var departmentName_query = elasticsearchUtils.buildQueryString("race.department.name.autocomplete", criteria.fulltext);

    if (departmentName_query) {
      query.bool.should.push(departmentName_query);
    }

    var departmentRegion_query = elasticsearchUtils.buildQueryString("race.department.region.autocomplete", criteria.fulltext);

    if (departmentRegion_query) {
      query.bool.should.push(departmentRegion_query);

    }

    var departmentCode_query = elasticsearchUtils.buildQueryString("race.department.code.autocomplete", criteria.fulltext);

    if (departmentCode_query) {
      query.bool.should.push(departmentCode_query);
    }

    var distanceType_query = elasticsearchUtils.buildQueryString("race.distanceType.i18n.autocomplete", criteria.fulltext);

    if (distanceType_query) {
      query.bool.should.push(distanceType_query);
    }

    var raceType_query = elasticsearchUtils.buildQueryString("race.type.name.autocomplete", criteria.fulltext);

    if (raceType_query) {
      query.bool.should.push(raceType_query);
    }

  }

  if (query.bool.should.length > 0) {
    operation.query = query;
  } else {
    operation.query = {
      "match_all": {}
    };
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(util.inspect(query, true, 7, true));
  }



  //filter

  var filter = {};
  filter.and = [];


  var type_filter = elasticsearchUtils.buildTermsFilter("race.type.name", criteria.types);
  if (type_filter) {
    filter.and.push(type_filter);
  }

  var department_filter = elasticsearchUtils.buildTermsFilter("race.department.code", criteria.departments);
  if (department_filter) {
    filter.and.push(department_filter);
  }

  var date_filter = elasticsearchUtils.buildDateRangeFilter("race.date", criteria.dateRange.startDate, criteria.dateRange.endDate);
  if (date_filter) {
    filter.and.push(date_filter);
  }

  var departmentOfRegion_filter;
  if (criteria.region) {
    departmentOfRegion_filter = elasticsearchUtils.buildTermsFilter("race.department.code", criteria.region.departments);
    if (departmentOfRegion_filter) {
      filter.and.push(departmentOfRegion_filter);
    }
  }

  var distance = 5;
  if (criteria.searchAround === true) {
    distance = criteria.distance;
  }

  var geoDistance_filter = elasticsearchUtils.buildGeoDistanceFilter(criteria.location, distance);
  if (geoDistance_filter) {
    filter.and.push(geoDistance_filter);
  }

  var published_filter = elasticsearchUtils.buildTermFilter("race.published", true);
  if (published_filter) {
    filter.and.push(published_filter);
  }

  if (filter.and.length > 0) {
    operation.filter = filter;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(util.inspect(filter, true, 7, true));
  }


  //facets

  var facets = {
    "departmentFacets": {
      "terms": {
        "field": "race.department.code",
        "order": "term",
        "all_terms": false
      }
    },
    "typeFacets": {
      "terms": {
        "field": "race.type.name",
        "order": "term",
        "all_terms": false
      }
    }
  };

  var departmentFacetFilter = {}
  departmentFacetFilter.and = [];
  var typeFacetFilter = {}
  typeFacetFilter.and = [];

  var date_filter_withRange = elasticsearchUtils.buildDateRangeFacetFilter("race.date", criteria.dateRange.startDate, criteria.dateRange.endDate);


  //add location facet filter on all facets
  if (geoDistance_filter) {
    departmentFacetFilter.and.push(geoDistance_filter);
    typeFacetFilter.and.push(geoDistance_filter);
  }

  //add date facet filter on all facets
  if (date_filter_withRange) {
    departmentFacetFilter.and.push(date_filter_withRange);
    typeFacetFilter.and.push(date_filter_withRange);
  }

  //add department of region facet filter on all facets
  if (departmentOfRegion_filter) {
    departmentFacetFilter.and.push(departmentOfRegion_filter);
    typeFacetFilter.and.push(departmentOfRegion_filter);
  }

  //set for all published filter
  if (published_filter) {
    departmentFacetFilter.and.push(published_filter);
    typeFacetFilter.and.push(published_filter);
  }


  //add departments facet filter on type facet only
  if (department_filter) {
    typeFacetFilter.and.push(department_filter);
  }

  //add types facet filter on department facet only
  if (type_filter) {
    departmentFacetFilter.and.push(type_filter);

  }

  //set type facet filter
  if (typeFacetFilter.and.length > 0) {
    facets.typeFacets.facet_filter = typeFacetFilter;
  }

  //set department facet filter
  if (departmentFacetFilter.and.length > 0) {
    facets.departmentFacets.facet_filter = departmentFacetFilter;
  }

  operation.facets = facets;

  if (process.env.NODE_ENV === 'development') {
    console.log(util.inspect(facets, true, 7, true));
  }

  operation.from = criteria.page;
  operation.size = criteria.size;
  operation.partial_fields = partial_fields;
  operation.sort = [criteria.sort];

  elasticSearchClient.search('racesidx_v1', 'race', operation)
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
    "partial_fields": {
      "partial1": {
        "exclude": "routes.*"
      }
    },
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



/**
 * @method Find all races
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {

  Race.findAll(function(err, races) {
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