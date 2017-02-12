process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require("sinon-chai"),
	app = require('../../../server'),
	RaceController = require('../../../app/controllers/raceController'),
	Race = mongoose.model('Race');

chai.use(sinonChai);


var req = {},
	res = {},
	next = function() {},
	sandbox = sinon.sandbox.create();

var race = {
	name: 'Duathlon de Castelnaudary',
	type: {
		name: 'duathlon',
		i18n: 'Duathlon'
	},
	department: {
		code: '11',
		name: 'Aude',
		region: 'Languedoc-Roussillon'
	},
	date: new Date(),
	edition: '1',
	distanceType: {
		name: 'S',
		i18n: ''
	}
}

afterEach(function() {
	sandbox.restore();
});


describe('load()', function() {

	beforeEach(function() {
		req = {
			race: {}
		};
	});

	it('should return a 400 when load race failed', function(done) {

		sandbox.stub(Race, 'load', function(id, cb) {
			cb({
				"errors": [{
					"message": "error"
				}]
			}, null);
		});

		res.json = function(httpStatus, err) {
			expect(httpStatus).to.equal(400);
			expect(err.message).to.be.an('array');
			expect(err.message[0]).to.equal("error.unknownId");
			done();
		};

		RaceController.load(req, res, next, 1);
	});

	it('should return a 400 when load return undefined race failed', function(done) {

		sandbox.stub(Race, 'load', function(id, cb) {
			cb(null, null);
		});

		res.json = function(httpStatus, err) {
			expect(httpStatus).to.equal(400);
			expect(err.message).to.be.an('array');
			expect(err.message[0]).to.equal("error.unknownId");
			done();
		};

		RaceController.load(req, res, next, 1);
	});

	it('should return req with a race return by database', function(done) {

		sandbox.stub(Race, 'load', function(id, cb) {
			cb(null, race);
		});

		RaceController.load(req, res, next, 1);

		expect(req.race).to.equal(race);

		done();

	});

});


describe('destroyAllRaceOfUser ()', function() {

	beforeEach(function() {
		req = {
			race: {},
			user: {}
		};
	});

	it('should return a 400 when destroyAllRaceOfUser failed', function(done) {

		sandbox.stub(Race, 'destroyAllRaceOfUser', function(user, cb) {
			cb({
				"errors": [{
					"message": "error"
				}]
			});
		});

		res.json = function(httpStatus, err) {
			expect(httpStatus).to.equal(400);
			expect(err.message).to.be.an('array');
			expect(err.message[0]).to.equal("error");
			done();
		};

		RaceController.destroyAllRaceOfUser(req, res, next);
	});

	it('should return no error with a race return by database', function(done) {

		sandbox.stub(Race, 'destroyAllRaceOfUser', function(user, cb) {
			cb(null);
		});

		RaceController.destroyAllRaceOfUser(req, res, next);

		done();

	});

});

describe('create()', function() {

	beforeEach(function() {
		req = {
			body: {
				race: race
			},
			user: {
				_id: 1,
				username: "user",
				password: "pass",
				role: 1
			}
		};
	});

	/*it('should return a 400 when create race failed', function(done) {

		//var race = new Race(req.body.race);

		var stubSave = function (callback) {
            cb({
				"errors": [{
					"message": "error"
				}]
			}, null);
        };

        //var race = new Race();
		//sinon.stub(race, "save").returns(stubSave);
        
        //var race = sinon.createStubInstance(Race);
        var stub = sinon.createStubInstance(Race);


        //sinon.stub(race, 'save', stubSave);

        //console.log(race.save());

		sandbox.stub(stub, 'save', function(cb) {
			cb({
				"errors": [{
					"message": "error"
				}]
			}, null);
		});

		res.json = function(httpStatus, err) {
			expect(httpStatus).to.equal(400);
			expect(err.message).to.be.an('array');
			expect(err.message[0]).to.equal('error');
			done();
		};

		RaceController.create(req, res);

	});

	it('should return 200 when race was created successfully', function(done) {

	});*/

});