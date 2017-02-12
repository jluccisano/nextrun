process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var elasticsearchUtils = require('../../app/utils/elasticsearchUtils'),
  assert = require('chai').assert;

describe('buildGeoDistanceFilter', function() {

  describe('valid parameters', function() {

    it('should return 40km', function() {
      var location = {
        lat: 43.1,
        lon: 1.5
      };

      var filter = elasticsearchUtils.buildGeoDistanceFilter(location, 40);
      assert.equal("40km", filter.geo_distance.distance);
    });
  });

  describe('invalid parameters', function() {
    it('should return undefined', function() {
      var filter = elasticsearchUtils.buildGeoDistanceFilter(undefined, 40);
      assert.isUndefined(filter, 'no filter defined');
    });
    it('should return undefined', function() {
      var filter = elasticsearchUtils.buildGeoDistanceFilter(undefined, undefined);
      assert.isUndefined(filter, 'no filter defined');
    });
    it('should return undefined', function() {

      var location = {
        lat: 43.1,
        lon: 1.5
      };

      var filter = elasticsearchUtils.buildGeoDistanceFilter(location, undefined);
      assert.isUndefined(filter, 'no filter defined');
    });
    it('should return undefined', function() {

      var location = {
        lat: "toto",
        lon: undefined
      };

      var filter = elasticsearchUtils.buildGeoDistanceFilter(location, "40");
      assert.isUndefined(filter, 'no filter defined');
    });
  });

});


describe('buildGeoDistanceFilter', function() {

  describe('valid parameters', function() {

    it('should return an array of terms', function() {
      var region = {
        name: "Bourgogne",
        departments : ['21','58','71','89']
      };

      var filter = elasticsearchUtils.buildTermsFilter("race.department.code", region.departments);
      assert.equal(region.departments, filter.terms["race.department.code"]);
    });
  });

  describe('invalid parameters', function() {

  });

});