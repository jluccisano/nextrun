/**
	describe('function()', function() {

		it('should return OK', function(done) {

		});

		it('should return NOK', function(done) {

		});
	});
**/

process.env.NODE_ENV = 'test';
process.env.PORT= 4000;

var mongoose = require('mongoose'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require("sinon-chai"),
	app = require('../../../server'),
	MainController = require('../../../app/controllers/mainController'),
	phantom = require('node-phantom-simple');

chai.use(sinonChai);


var req = {},
	res = {},
	err = {},
	sandbox = sinon.sandbox.create();

afterEach(function() {
	sandbox.restore();
});

describe('MainController', function() {

	describe('generateSnapshot()', function() {

		beforeEach(function() {
			req = {
				path: '/'
			};
		});


		it('should return a 404 when create phantom instance failed', function(done) {

			sandbox.stub(phantom, 'create', function(cb) {
				cb(err, null);
			});

			res.send = function(httpStatus, err) {
				expect(httpStatus).to.equal(404);
				expect(err).to.equal("cannot generate snapshot");
				done();
			};

			MainController.generateSnapshot(req, res);

		});
	});


});