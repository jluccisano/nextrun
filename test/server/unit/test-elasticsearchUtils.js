process.env.NODE_ENV = 'test';
process.env.PORT= 4000;
/**
 * Module dependencies.
 */

var elasticsearchUtils = require('../../../app/utils/elasticsearchUtils'),
  chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect;

describe('buildGeoDistanceFilter()', function() {

  describe('valid parameters', function() {

    it('should return 40km', function(done) {
      var location = {
        lat: 43.1,
        lon: 1.5
      };

      var filter = elasticsearchUtils.buildGeoDistanceFilter(location, 40);
      assert.equal("40km", filter.geo_distance.distance);
      done();
    });

  });

  describe('invalid parameters', function() {

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildGeoDistanceFilter(undefined, 40);
      assert.isUndefined(filter, 'no filter defined');
      done();
    });

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildGeoDistanceFilter(undefined, undefined);
      assert.isUndefined(filter, 'no filter defined');
      done();
    });

    it('should return undefined', function(done) {

      var location = {
        lat: 43.1,
        lon: 1.5
      };

      var filter = elasticsearchUtils.buildGeoDistanceFilter(location, undefined);
      assert.isUndefined(filter, 'no filter defined');
      done();
    });

    it('should return undefined', function(done) {

      var location = {
        lat: "toto",
        lon: undefined
      };

      var filter = elasticsearchUtils.buildGeoDistanceFilter(location, "40");
      assert.isUndefined(filter, 'no filter defined');
      done();
    });
  });

});


describe('buildTermsFilter()', function() {

  describe('valid parameters', function() {

    it('should return an array of terms', function(done) {
      var region = {
        name: "Bourgogne",
        departments: ['21', '58', '71', '89']
      };

      var filter = elasticsearchUtils.buildTermsFilter("race.department.code", region.departments);
      expect(region.departments).to.equal(filter.terms["race.department.code"]);

      done();
    });
  });

  describe('invalid parameters', function(done) {

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildTermsFilter("race.department.code", undefined);
      expect(filter).to.equal(undefined);
      done();
    });
  });

});

describe('buildTermFilter()', function() {

  describe('valid parameters', function() {

    it('should return a term', function(done) {
      var filter = elasticsearchUtils.buildTermFilter("race.published", true);
      expect(true).to.equal(filter.term["race.published"]);

      done();
    });
  });

  describe('invalid parameters', function(done) {

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildTermFilter(undefined, undefined);
      expect(filter).to.equal(undefined);
      done();
    });
  });

});

describe('buildQueryString()', function() {

  describe('valid parameters', function() {

    it('should return a term', function(done) {
      var filter = elasticsearchUtils.buildQueryString("race.name.autocomplete", "duathlon");
      expect("duathlon").to.equal(filter.query_string.query);
      done();
    });
  });

  describe('invalid parameters', function(done) {

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildQueryString(undefined, undefined);
      expect(filter).to.equal(undefined);
      done();
    });
  });

});

describe('buildDateRangeFilter()', function() {

  describe('valid parameters', function() {

    it('should return a term', function(done) {

      var startDate = new Date();
      var endDate = new Date();

      var filter = elasticsearchUtils.buildDateRangeFilter("race.date", startDate, endDate);
      expect(startDate).to.equal(filter.range["race.date"].from);
      expect(endDate).to.equal(filter.range["race.date"].to);
      done();
    });
  });

  describe('invalid parameters', function(done) {

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildDateRangeFilter(undefined, undefined, undefined);
      expect(filter).to.equal(undefined);
      done();
    });
  });

});

describe('buildDateRangeFacetFilter()', function() {

  describe('valid parameters', function() {

    it('should return a term', function(done) {

      var startDate = new Date();
      var endDate = new Date();

      var filter = elasticsearchUtils.buildDateRangeFacetFilter("race.date", startDate, endDate);
      expect(startDate).to.equal(filter.range["race.date"].gt);
      expect(endDate).to.equal(filter.range["race.date"].lte);
      done();
    });
  });

  describe('invalid parameters', function(done) {

    it('should return undefined', function(done) {
      var filter = elasticsearchUtils.buildDateRangeFacetFilter(undefined, undefined, undefined);
      expect(filter).to.equal(undefined);
      done();
    });
  });

});