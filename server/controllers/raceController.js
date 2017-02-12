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
    underscore = require("underscore"),
    logger = require("../logger");

var serverOptions = {
    host: "localhost",
    port: 9200
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

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
                    type: [race.place.location.latitude, race.place.location.longitude]
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
                    type: [race.place.location.latitude, race.place.location.longitude]
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

/**
 * @method Search races by criteria
 * @param req
 * @param res
 */
exports.searchOld = function(req, res) {

    var criteria;

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.criteria)) {

        criteria = req.body.criteria;

        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
            logger.info(util.inspect(criteria, true, 7, true));
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

        if (!underscore.isUndefined(criteria.fulltext) && criteria.fulltext.length > 2) {

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
        if (!underscore.isUndefined(criteria.dateRanges) && criteria.dateRanges[0] && !underscore.isUndefined(criteria.dateRanges[0].startDate) && !underscore.isUndefined(criteria.dateRanges[0].endDate)) {
            dateFilter = elasticsearchUtils.buildDateRangeFilter("race.date", criteria.dateRanges[0].startDate, criteria.dateRanges[0].endDate);
        }
        if (dateFilter) {
            filter.and.push(dateFilter);
        }

        var departmentOfRegionFilter;
        if (criteria.region !== "" && !underscore.isUndefined(criteria.region) && !underscore.isUndefined(criteria.region.departments)) {
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
        if (!underscore.isUndefined(criteria.dateRanges) && criteria.dateRanges[0] && !underscore.isUndefined(criteria.dateRanges[0].startDate) && !underscore.isUndefined(criteria.dateRanges[0].endDate)) {
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

        if (!underscore.isUndefined(criteria.from)) {
            operation.from = criteria.from;
        }

        if (!underscore.isUndefined(criteria.size)) {
            operation.size = criteria.size;

        }

        if (!underscore.isUndefined(criteria.sort)) {
            operation.sort = [criteria.sort];
        }

        operation.partialFields = partialFields;

        console.log("1");

        console.log(elasticSearchClient);
        elasticSearchClient.search(config.racesidx, "race", operation, function(err, data) {

            console.log(err);

            console.log(data);

            if (err) {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }

            if (data) {
                if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
                    logger.info(JSON.parse(data));
                }
                return res.status(200).json(JSON.parse(data));
            } else {
                return res.status(400).json({
                    message: ["error.noData"]
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
 * @method Autocomplete
 * @param req
 * @param res
 */
exports.suggest = function(req, res) {

    var criteria;
    var query;

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.criteria)) {

        criteria = req.body.criteria;
        var fulltext = "";

        if (!underscore.isUndefined(criteria.fulltext)) {
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

        if (!underscore.isUndefined(criteria.region)) {

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
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }

            if (data) {
                if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
                    logger.info(JSON.parse(data));
                }
                return res.status(200).json(JSON.parse(data));
            } else {
                return res.status(400).json({
                    message: ["error.noData"]
                });
            }
        });

    } else {
        return res.status(400).json({
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