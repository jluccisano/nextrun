/**
 * @method Build a geo distance filter
 * @param req
 * @param res
 */
exports.buildGeoDistanceFilter = function(location, distance) {

    var result;

      if(typeof(location) != 'undefined') {

        result = { 
          'geo_distance': {
            'distance': distance+'km',
              'race.pin.location': {
                'lat': location.lat,
                'lon': location.lon
              }
            }
          };
      } else {
        throw new Error("location or/and distance are undefined");
      }

  return result;

};

exports.buildQueryString = function(field, query) {

  var result = {}
  result.queryString = {};

  result.queryString.default_field = field;
  result.queryString.query = query;

  return result;
};