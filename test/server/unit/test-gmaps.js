process.env.NODE_ENV = 'test';
process.env.PORT= 4000;

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	should = require('should'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require("sinon-chai"),
	app = require('../../../server'),
	RaceController = require('../../../app/controllers/raceController'),
	Race = mongoose.model('Race'),
	Schema = mongoose.Schema,
	gm = require('googlemaps'),
	gmaps = require('../../../config/middlewares/gmaps');

chai.use(sinonChai);

var req = {},
	res = {},
	next = function() {},
	sandbox = sinon.sandbox.create();

afterEach(function() {
	sandbox.restore();
});

describe('Gmaps', function() {

	describe('geocodeAddress()', function() {

		beforeEach(function() {
			req = {
				body: {
					race: {
						plan: {
							address: {
								address1: "3 rue d'Occitanie",
								address2: '',
								postcode: '31290',
								city: "Montgaillard-Lauragais"
							}
						}
					}
				},
				race: {
					plan: {
						address: {
							address1: "3 rue d'Occitanie",
							address2: '',
							postcode: '31290',
							city: "Montgaillard-Lauragais"
						}
					}
				}
			};
		});

		describe('valid parameters', function() {



			it('should do nothing when req body is undefined', function(done) {

				req.body.race = undefined;

				sandbox.stub(gm, 'geocode', function(undefined, cb) {
					cb(null, null);

				});

				updateLatLngStub = sandbox.stub(RaceController, 'updateLatLng');

				gmaps.geocodeAddress(req, res, next);

				expect(updateLatLngStub.calledOnce).to.be.false;

				done();
			});

			it('should do nothing when address has not changed', function(done) {

				sandbox.stub(gm, 'geocode', function(undefined, cb) {
					cb(null, null);

				});

				updateLatLngStub = sandbox.stub(RaceController, 'updateLatLng');

				gmaps.geocodeAddress(req, res, next);

				expect(updateLatLngStub.calledOnce).to.be.false;

				done();
			});

			it('should do nothing is google throw error ', function(done) {

				req.body.race.plan.address.city = "Villefranche-de-Lauragais";

				sandbox.stub(gm, 'geocode', function(undefined, cb) {
					cb({
						"errors": [{
							"message": "error"
						}]
					}, null);

				});

				updateLatLngStub = sandbox.stub(RaceController, 'updateLatLng');
				updateLatLngStub.returns(true);


				gmaps.geocodeAddress(req, res, next);

				expect(updateLatLngStub.calledOnce).to.be.false;

				done();
			});

			it('should do nothing when updateLatLng throw an exception ', function(done) {

				req.body.race.plan.address.city = "Villefranche-de-Lauragais";

				sandbox.stub(gm, 'geocode', function(undefined, cb) {
					cb(null, {
						results: [{
							geometry: {
								location: {
									lat: 43.6,
									lon: 1.5
								}
							}
						}]
					});

				});

				updateLatLngStub = sandbox.stub(RaceController, 'updateLatLng');
				updateLatLngStub.throws();


				gmaps.geocodeAddress(req, res, next);

				expect(updateLatLngStub.threw()).to.be.true;

				done();
			});


			it('should updateLatLng successfully ', function(done) {

				req.body.race.plan.address.city = "Villefranche-de-Lauragais";

				sandbox.stub(gm, 'geocode', function(undefined, cb) {
					cb(null, {
						results: [{
							geometry: {
								location: {
									lat: 43.6,
									lon: 1.5
								}
							}
						}]
					});

				});

				updateLatLngStub = sandbox.stub(RaceController, 'updateLatLng');
				updateLatLngStub.returns(true);


				gmaps.geocodeAddress(req, res, next);

				expect(updateLatLngStub.calledOnce).to.be.true;

				done();
			});

		});
	});

});