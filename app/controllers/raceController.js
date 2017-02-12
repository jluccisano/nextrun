/**
 * @module Race Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
  Race = mongoose.model("Race"),
  errorUtils = require("../utils/errorUtils"),
  util = require("util"),
  elasticsearchUtils = require("../utils/elasticsearchUtils"),
  ElasticSearchClient = require("elasticsearchclient"),
  env = process.env.NODE_ENV || "development",
  config = require("../../config/config")[env],
  _ = require("underscore"),
  logger = require("../../config/logger.js");

var serverOptions = {
  host: "localhost",
  port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {
  Race.load(id, function(err, race) {
    if (err) {
      logger.error(err);
      return res.json(400, {
        message: ["error.unknownId"]
      });
    }
    if (!race) {
      logger.error("error.unknownId");
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

  var body = req.body;
  var userConnected = req.user;

  if (!_.isUndefined(body) && !_.isUndefined(body.race)) {

    if (!_.isUndefined(userConnected) && !_.isUndefined(userConnected._id)) {

      var race = new Race(req.body.race);
      race.lastUpdate = new Date();
      race.createdDate = new Date();
      race.userId = userConnected._id;

      race.save(function(err, race) {
        if (err) {
          logger.error(err);
          return res.json(400, {
            message: errorUtils.errors(err.errors)
          });
        } else {
          return res.json(200, {
            raceId: race._id
          });
        }

      });
    } else {
      return res.json(400, {
        message: ["error.userNotConnected"]
      });
    }
  } else {
    return res.json(400, {
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
    if (err) {
      logger.error(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    if (races) {
      return res.json(200, {
        races: races
      });
    } else {
      logger.error("error.occured");
      return res.json(400, {
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

  if (!_.isUndefined(race)) {
    return res.json(200, {
      race: race
    });
  } else {
    return res.json(400, {
      message: ["error.unknownRace"]
    });
  }
};

/**
 * @method update race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.update = function(req, res) {

  var race = req.race;
  var userConnected = req.user;
  var raceToUpdate;

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.race)) {

    raceToUpdate = req.body.race;

    if (!_.isUndefined(race) && !_.isUndefined(race.userId) && !_.isUndefined(race._id)) {

      if (!_.isUndefined(userConnected) && !_.isUndefined(userConnected._id)) {

        if (race.userId.equals(userConnected._id)) {

          if (!_.isUndefined(raceToUpdate.lastUpdate)) {
            raceToUpdate.lastUpdate = new Date();
          }

          if (!_.isUndefined(raceToUpdate._id)) {
            delete raceToUpdate._id;
          }

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
              logger.error(err);
              return res.json(400, {
                message: errorUtils.errors(err.errors)
              });
            }
          });
        } else {
          logger.error("error.userNotOwner");
          return res.json(400, {
            message: ["error.userNotOwner"]
          });
        }
      } else {
        return res.json(400, {
          message: ["error.userNotConnected"]
        });
      }
    } else {
      return res.json(400, {
        message: ["error.unknownRace"]
      });
    }
  } else {
    return res.json(400, {
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
  var userConnected = req.user;

  if (!_.isUndefined(race) && !_.isUndefined(race.userId)) {

    if (!_.isUndefined(userConnected) && !_.isUndefined(userConnected._id)) {

      if (req.race.userId.equals(userConnected._id)) {
        Race.destroy(race._id, function(err) {
          if (!err) {
            return res.json(200);
          } else {
            logger.error(err);
            return res.json(400, {
              message: errorUtils.errors(err.errors)
            });
          }
        });
      } else {
        logger.error("error.userNotOwner");
        return res.json(400, {
          message: ["error.userNotOwner"]
        });
      }
    } else {
      return res.json(400, {
        message: ["error.userNotConnected"]
      });
    }
  } else {
    return res.json(400, {
      message: ["error.unknownRace"]
    });
  }
};

/**
 * @method update LatLng of event address
 * @param req
 * @param res
 */
exports.updateLatLng = function(raceId, latlng) {

  var result = false;

  if (_.isUndefined(latlng)) {
    throw new Error("latlng is not defined");
  }

  if (_.isUndefined(raceId)) {
    throw new Error("raceId is not defined");
  }

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
      logger.error("error during try to update latlng for: " + raceId + " , details: " + err);
      result = false;
    } else {
      logger.info("latlng updated for: " + raceId);
      result = true;
    }
  });
  return result;
};

/**
 * @method publish the race
 * @param req
 * @param res
 */
exports.publish = function(req, res) {
  var race = req.race;
  var userConnected = req.user;
  var value = false;


  if (!_.isUndefined(req.params) && !_.isUndefined(req.params.value)) {
    value = req.params.value;
  }

  if (!_.isUndefined(race) && !_.isUndefined(race.userId)) {

    if (!_.isUndefined(userConnected) && !_.isUndefined(userConnected._id)) {

      if (race.userId.equals(userConnected._id)) {

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
            return res.json(200);
          } else {
            logger.error(err);
            return res.json(400, {
              message: errorUtils.errors(err.errors)
            });
          }
        });

      } else {
        logger.error("error.userNotOwner");
        return res.json(400, {
          message: ["error.userNotOwner"]
        });
      }
    } else {
      return res.json(400, {
        message: ["error.userNotConnected"]
      });
    }
  } else {
    return res.json(400, {
      message: ["error.unknownRace"]
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

  var user = req.user;

  if (!_.isUndefined(user)) {
    Race.destroyAllRaceOfUser(req.user, function(err) {
      if (!err) {
        next();
      } else {
        logger.error(err);
        return res.json(400, {
          message: errorUtils.errors(err.errors)
        });
      }
    });
  } else {
    return res.json(400, {
      message: ["error.unknownUser"]
    });
  }


};

/**
 * @method Search races by criteria
 * @param req
 * @param res
 */
exports.search = function(req, res) {

  var criteria;

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.criteria)) {

    criteria = req.body.criteria;

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      console.log(util.inspect(criteria, true, 7, true));
    }

    var operation = {
      from: 0,
      size: 20,
      sort: "_score"
    };

    var partialFields = {
      "partial1": {
        "exclude": "routes.*"
      }
    };

    //query

    var query = {
      bool: {
        should: []
      }
    };

    if (!_.isUndefined(criteria.fulltext) && criteria.fulltext.length > 2) {

      var raceNameQuery = elasticsearchUtils.buildQueryString("race.name.autocomplete", criteria.fulltext);

      if (raceNameQuery) {
        query.bool.should.push(raceNameQuery);
      }

      var departmentNameQuery = elasticsearchUtils.buildQueryString("race.pin.department.name.autocomplete", criteria.fulltext);

      if (departmentNameQuery) {
        query.bool.should.push(departmentNameQuery);
      }

      var departmentRegionQuery = elasticsearchUtils.buildQueryString("race.pin.department.region.autocomplete", criteria.fulltext);

      if (departmentRegionQuery) {
        query.bool.should.push(departmentRegionQuery);

      }

      var departmentCodeQuery = elasticsearchUtils.buildQueryString("race.pin.department.code.autocomplete", criteria.fulltext);

      if (departmentCodeQuery) {
        query.bool.should.push(departmentCodeQuery);
      }

      var distanceTypeQuery = elasticsearchUtils.buildQueryString("race.distanceType.i18n.autocomplete", criteria.fulltext);

      if (distanceTypeQuery) {
        query.bool.should.push(distanceTypeQuery);
      }

      var raceTypeQuery = elasticsearchUtils.buildQueryString("race.type.name.autocomplete", criteria.fulltext);

      if (raceTypeQuery) {
        query.bool.should.push(raceTypeQuery);
      }

    }

    if (query.bool.should.length > 0) {
      operation.query = query;
    } else {
      operation.query = {
        "match_all": {}
      };
    }

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      logger.debug(util.inspect(query, true, 7, true));
    }



    //filter

    var filter = {};
    filter.and = [];


    var typeFilter = elasticsearchUtils.buildTermsFilter("race.type.name", criteria.types);
    if (typeFilter) {
      filter.and.push(typeFilter);
    }

    var departmentFilter = elasticsearchUtils.buildTermsFilter("race.pin.department.code", criteria.departments);
    if (departmentFilter) {
      filter.and.push(departmentFilter);
    }

    var dateFilter;
    if (!_.isUndefined(criteria.dateRanges) && criteria.dateRanges[0] && !_.isUndefined(criteria.dateRanges[0].startDate) && !_.isUndefined(criteria.dateRanges[0].endDate)) {
      dateFilter = elasticsearchUtils.buildDateRangeFilter("race.date", criteria.dateRanges[0].startDate, criteria.dateRanges[0].endDate);
    }
    if (dateFilter) {
      filter.and.push(dateFilter);
    }

    var departmentOfRegionFilter;
    if (criteria.region !== "" && !_.isUndefined(criteria.region) && !_.isUndefined(criteria.region.departments)) {
      departmentOfRegionFilter = elasticsearchUtils.buildTermsFilter("race.pin.department.code", criteria.region.departments);
      if (departmentOfRegionFilter) {
        filter.and.push(departmentOfRegionFilter);
      }
    }

    var distance = 5;
    if (criteria.searchAround === true) {
      distance = criteria.distance;
    }

    var geoDistanceFilter = elasticsearchUtils.buildGeoDistanceFilter(criteria.location, distance);
    if (geoDistanceFilter) {
      filter.and.push(geoDistanceFilter);
    }

    var publishedFilter = elasticsearchUtils.buildTermFilter("race.published", true);
    if (publishedFilter) {
      filter.and.push(publishedFilter);
    }

    if (filter.and.length > 0) {
      operation.filter = filter;
    }

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      logger.debug(util.inspect(filter, true, 7, true));
    }



    //facets

    var facets = {
      "departmentFacets": {
        "terms": {
          "field": "race.pin.department.code",
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

    var departmentFacetFilter = {};
    departmentFacetFilter.and = [];
    var typeFacetFilter = {};
    typeFacetFilter.and = [];

    var dateFilterWithRange;
    if (!_.isUndefined(criteria.dateRanges) && criteria.dateRanges[0] && !_.isUndefined(criteria.dateRanges[0].startDate) && !_.isUndefined(criteria.dateRanges[0].endDate)) {
      dateFilterWithRange = elasticsearchUtils.buildDateRangeFacetFilter("race.date", criteria.dateRanges[0].startDate, criteria.dateRanges[0].endDate);
    }

    //add location facet filter on all facets
    if (geoDistanceFilter) {
      departmentFacetFilter.and.push(geoDistanceFilter);
      typeFacetFilter.and.push(geoDistanceFilter);
    }

    //add date facet filter on all facets
    if (dateFilterWithRange) {
      departmentFacetFilter.and.push(dateFilterWithRange);
      typeFacetFilter.and.push(dateFilterWithRange);
    }

    //add department of region facet filter on all facets
    if (departmentOfRegionFilter) {
      departmentFacetFilter.and.push(departmentOfRegionFilter);
      typeFacetFilter.and.push(departmentOfRegionFilter);
    }

    //set for all published filter
    if (publishedFilter) {
      departmentFacetFilter.and.push(publishedFilter);
      typeFacetFilter.and.push(publishedFilter);
    }


    //add departments facet filter on type facet only
    if (departmentFilter) {
      typeFacetFilter.and.push(departmentFilter);
    }

    //add types facet filter on department facet only
    if (typeFilter) {
      departmentFacetFilter.and.push(typeFilter);

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

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      logger.debug(util.inspect(facets, true, 7, true));
    }

    if (!_.isUndefined(criteria.from)) {
      operation.from = criteria.from;
    }

    if (!_.isUndefined(criteria.size)) {
      operation.size = criteria.size;

    }

    if (!_.isUndefined(criteria.sort)) {
      operation.sort = [criteria.sort];
    }

    operation.partialFields = partialFields;


    elasticSearchClient.search(config.racesidx, "race", operation, function(err, data) {
      if (err) {
        logger.error(err);
        return res.json(400, {
          message: errorUtils.errors(err.errors)
        });
      }

      if (data) {
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
          console.log(JSON.parse(data));
        }
        return res.json(200, JSON.parse(data));
      } else {
        return res.json(400, {
          message: ["error.noData"]
        });
      }
    });
  } else {
    return res.json(400, {
      message: ["error.noCriteria"]
    });
  }
};

/**
 * @method Autocomplete
 * @param req
 * @param res
 */
exports.autocomplete = function(req, res) {

  var criteria;
  var query;

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.criteria)) {

    criteria = req.body.criteria;
    var fulltext = "";

    if (!_.isUndefined(criteria.fulltext)) {
      fulltext = criteria.fulltext;
    }


    query = {
      "partialFields": {
        "partial1": {
          "exclude": "routes.*"
        }
      },
      "query": {
        "bool": {
          "should": [{
              "query_string": {
                "default_field": "race.name.autocomplete",
                "query": fulltext
              }
            }, {
              "query_string": {
                "default_field": "race.pin.department.name.autocomplete",
                "query": fulltext
              }
            }, {
              "query_string": {
                "default_field": "race.pin.department.region.autocomplete",
                "query": fulltext
              }
            }, {
              "query_string": {
                "default_field": "race.pin.department.code.autocomplete",
                "query": fulltext
              }
            }, {
              "query_string": {
                "default_field": "race.distanceType.i18n.autocomplete",
                "query": fulltext
              }
            }, {
              "query_string": {
                "default_field": "race.type.name.autocomplete",
                "query": fulltext
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

    if (!_.isUndefined(criteria.region)) {

      query.filter.and.push({
        "terms": {
          "race.pin.department.code": criteria.region.departments
        }
      });
    }

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      logger.debug(util.inspect(query, true, 7, true));
    }

    elasticSearchClient.search(config.racesidx, "race", query, function(err, data) {
      if (err) {
        logger.error(err);
        return res.json(400, {
          message: errorUtils.errors(err.errors)
        });
      }

      if (data) {
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
          console.log(JSON.parse(data));
        }
        return res.json(200, JSON.parse(data));
      } else {
        return res.json(400, {
          message: ["error.noData"]
        });
      }
    });

  } else {
    return res.json(400, {
      message: ["error.noCriteria"]
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
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    if (races) {
      return res.json(200, {
        races: races
      });
    } else {
      return res.json(400, {
        message: ["error.occured"]
      });
    }
  });
};