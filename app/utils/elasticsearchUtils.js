var _ = require("underscore");
/**
 * @method Build a geo distance filter
 * @param req
 * @param res
 */
exports.buildGeoDistanceFilter = function(location, distance) {

  var geoFilter;

  if (!_.isUndefined(location) && !_.isUndefined(distance)) {

    if (!_.isUndefined(location.lat) && !_.isUndefined(location.lon)) {

      geoFilter = {
        "geo_distance": {
          "distance": distance + "km",
          "race.pin.location": {
            "lat": location.lat.toString() ,
            "lon": location.lon.toString() 
          }
        }
      };
    }
  }
  return geoFilter;

};

exports.buildTermFilter = function(field, term) {
  var term_filter;

  if (!_.isUndefined(field) && !_.isUndefined(term)) {

    term_filter = {};
    term_filter.term = {};
    term_filter.term[field] = term;
   
  }

  return term_filter;

};

exports.buildTermsFilter = function(field, terms) {
  var terms_filter;

  if (!_.isUndefined(field) && Array.isArray(terms) && terms.length > 0) {

    terms_filter = {};
    terms_filter.terms = {};
    terms_filter.terms[field] = terms;
   
  }

  return terms_filter;

};

exports.buildDateRangeFilter = function(field, from, to) {

  var dateRange_filter;

  if (!_.isUndefined(field) && !_.isUndefined(from) && !_.isUndefined(to)) {

    var fromDate = new Date(from);
    var toDate = new Date(to);

    if (Object.prototype.toString.call(fromDate) === "[object Date]" && Object.prototype.toString.call(toDate) === "[object Date]") {

      dateRange_filter = {};
      dateRange_filter.range = {};

      dateRange_filter.range[field] = {
        "from": from,
        "to": to
      };
    }
  }
  return dateRange_filter;
};

exports.buildDateRangeFacetFilter = function(field, from, to) {

  var dateRange_filter;

  if (!_.isUndefined(field) && !_.isUndefined(from) && !_.isUndefined(to)) {

    var fromDate = new Date(from);
    var toDate = new Date(to);

    if (Object.prototype.toString.call(fromDate) === "[object Date]" && Object.prototype.toString.call(toDate) === "[object Date]") {


      dateRange_filter = {};
      dateRange_filter.range = {};

      dateRange_filter.range[field] = {
        "gt": from,
        "lte": to
      };
    }
  }
  return dateRange_filter;
};

exports.buildQueryString = function(field, query) {

  var queryString;

  if (!_.isUndefined(field) && !_.isUndefined(query)) {

    queryString = {
      "query_string": {
        "default_field": field,
        "query": query
      }
    };
  }

  return queryString;
};