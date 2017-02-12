process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var elasticsearchUtils = require('../../app/utils/elasticsearchUtils'),
assert = require('assert');

describe('buildGeoDistanceFilter', function(){

  describe('valid parameters', function(){

    it('should return 40km', function(){
      var location = {
      	lat: 43.1,
      	lon: 1.5
      };
      	
      var filter = elasticsearchUtils.buildGeoDistanceFilter(location,40);
      console.log(filter);
      assert.equal("40km", filter.geo_distance.distance);
    });
  });

  describe('invalid parameters', function(){

    it('should return error', function(){
      var filter = elasticsearchUtils.buildGeoDistanceFilter(undefined,40);
      console.log(filter);
      //assert.equal("40km", filter.geo_distance.distance);
    })
  })

});