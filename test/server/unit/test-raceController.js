/**
	describe("function()", function() {

		it("should return OK", function(done) {

		});

		it("should return NOK", function(done) {

		});
	});
**/

process.env.NODE_ENV = "test";
process.env.PORT = 4000;

var mongoose = require("mongoose"),
	should = require("should"),
	chai = require("chai"),
	expect = chai.expect,
	sinon = require("sinon"),
	sinonChai = require("sinon-chai"),
	app = require("../../../server"),
	RaceController = require("../../../server/controllers/raceController"),
	Race = mongoose.model("Race"),
	Schema = mongoose.Schema,
	ElasticSearchClient = require("elasticsearchclient");

chai.use(sinonChai);


var req = {},
	res = {},
	next = function() {},
	sandbox = sinon.sandbox.create();

var race = {
	_id: mongoose.Types.ObjectId("88a7082cad21354c23000001"),
	name: "Duathlon de Castelnaudary",
	type: {
		name: "duathlon",
		i18n: "Duathlon"
	},
	department: {
		code: "11",
		name: "Aude",
		region: "Languedoc-Roussillon"
	},
	date: new Date(),
	edition: "1",
	distanceType: {
		name: "S",
		i18n: ""
	},
	userId: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
	last_update: new Date()
}

afterEach(function() {
	sandbox.restore();
});

describe("RaceController", function() {

	describe("load()", function() {

		beforeEach(function() {
			req = {
				race: {}
			};
		});

		it("should return a 400 when load race failed", function(done) {

			sandbox.stub(Race, "load", function(id, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownId");
						done();

					}
				};
			};

			RaceController.load(req, res, next, 1);
		});

		it("should return a 400 when load return undefined race failed", function(done) {

			sandbox.stub(Race, "load", function(id, cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownId");
						done();

					}
				};
			};

			RaceController.load(req, res, next, 1);
		});

		it("should return req with a race return by database", function(done) {

			sandbox.stub(Race, "load", function(id, cb) {
				cb(null, race);
			});

			RaceController.load(req, res, next, 1);

			expect(req.race).to.equal(race);

			done();

		});

	});


	describe("destroyAllRaceOfUser ()", function() {

		beforeEach(function() {
			req = {
				race: {},
				user: {
					_id: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
					username: "user",
					password: "pass",
					role: 1
				}
			};
		});

		it("should return a 400 when destroyAllRaceOfUser failed", function(done) {

			sandbox.stub(Race, "destroyAllRaceOfUser", function(user, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();

					}
				};
			};

			RaceController.destroyAllRaceOfUser(req, res, next);
		});

		it("should return a 400 when unknownUser", function(done) {

			req.user = undefined;

			sandbox.stub(Race, "destroyAllRaceOfUser", function(user, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownUser");
						done();

					}
				};
			};

			RaceController.destroyAllRaceOfUser(req, res, next);
		});

		it("should return no error with a race return by database", function(done) {

			sandbox.stub(Race, "destroyAllRaceOfUser", function(user, cb) {
				cb(null);
			});

			RaceController.destroyAllRaceOfUser(req, res, next);

			done();

		});

	});

	describe("findByUser()", function() {

		beforeEach(function() {
			req = {
				params: {
					page: 1
				},
				user: {
					_id: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
					username: "user",
					password: "pass",
					role: 1
				}
			};
		});

		it("should return a 400 when find by user failed", function(done) {

			var options = {};

			sandbox.stub(Race, "findByCriteria", function(options, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.findByUser(req, res);
		});

		it("should return a 400 when database return null failed", function(done) {

			var options = {};

			sandbox.stub(Race, "findByCriteria", function(options, cb) {
				cb(null, null);
			});


			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.occured");
						done();
					}
				};
			};

			RaceController.findByUser(req, res);
		});

		it("should return a 200 with races when find by user failed", function(done) {

			var options = {};
			var mockRaces = [];
			mockRaces.push(race);

			sandbox.stub(Race, "findByCriteria", function(options, cb) {
				cb(null, mockRaces);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data.races).to.be.an("array");
						expect(data.races[0]).to.equal(mockRaces[0]);
						done();
					}
				};

			};

			RaceController.findByUser(req, res);
		});

	});

	describe("create()", function() {

		beforeEach(function() {
			req = {
				body: {
					race: race
				},
				user: {
					_id: "52a7082cad21354c23000001",
					username: "user",
					password: "pass",
					role: 1
				}
			};
		});

		it("should return a 400 when bodyParamRequired", function(done) {

			req.body = undefined;

			var userValidateStub = sandbox.stub(Schema.prototype, "path").returns();

			sandbox.stub(Race.prototype, "save", function(cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.bodyParamRequired");
						done();
					}
				};
			};

			RaceController.create(req, res);
		});

		it("should return a 400 when userNotConnected", function(done) {

			req.user = undefined;

			var userValidateStub = sandbox.stub(Schema.prototype, "path").returns();

			sandbox.stub(Race.prototype, "save", function(cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotConnected");
						done();
					}
				};
			};

			RaceController.create(req, res);
		});

		it("should return a 400 when create race failed", function(done) {

			var userValidateStub = sandbox.stub(Schema.prototype, "path").returns();

			sandbox.stub(Race.prototype, "save", function(cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.create(req, res);
		});

		it("should return a 200 when user was created successfully", function(done) {

			var userValidateStub = sandbox.stub(Schema.prototype, "path").returns();

			sandbox.stub(Race.prototype, "save", function(cb) {
				cb(null, race);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data.raceId).to.equal(race._id);
						done();
					}
				};

			};

			RaceController.create(req, res);
		});

	});


	describe("find()", function() {

		it("should return 400 unknownRace", function(done) {

			//set race to undefined
			req.race = undefined;

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownRace");
						done();
					}
				};
			};

			RaceController.find(req, res);
		});

		it("should return 200", function(done) {

			req.race = race;


			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(200);
						done();
					}
				};
			};

			RaceController.find(req, res);
		});
	});


	describe("update()", function() {

		beforeEach(function() {
			req = {
				user: {
					_id: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
					username: "user",
					password: "pass",
					role: 1
				},
				body: {
					race: {
						name: "Triathlon de Castelnaudary",
						type: {
							name: "duathlon",
							i18n: "Duathlon"
						},
						department: {
							code: "11",
							name: "Aude",
							region: "Languedoc-Roussillon"
						},
						date: new Date(),
						edition: "1",
						distanceType: {
							name: "S",
							i18n: ""
						},
						userId: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
						last_update: new Date()
					}
				},
				race: race
			};
		});


		it("should return error 400 when body param is not set", function(done) {

			req.body.race = undefined;

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.bodyParamRequired");
						done();
					}
				};
			};

			RaceController.update(req, res);

		});

		it("should return error 400 when unknownRace", function(done) {

			//set user to undefined
			req.race = undefined;

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownRace");
						done();
					}
				};
			};

			RaceController.update(req, res);

		});

		it("should return error 400 when userNotConnected", function(done) {

			//set user to undefined
			req.user = undefined;

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotConnected");
						done();
					}
				};
			};

			RaceController.update(req, res);

		});

		it("should return error 400 when userNotOwner", function(done) {

			//set different user id
			req.user._id = mongoose.Types.ObjectId("52a7082cad21354c23000002");

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotOwner");
						done();
					}
				};
			};

			RaceController.update(req, res);

		});


		it("should return error 400 when database crash", function(done) {

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.update(req, res);

		});

		it("should return 200", function(done) {

			req.body.race._id = mongoose.Types.ObjectId("52a7082cad21354c23000002");

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb(null);
			});

			res.sendStatus = function(httpStatus) {
				expect(httpStatus).to.equal(200);
				done();
			};

			RaceController.update(req, res);

		});



	});


	describe("delete()", function() {

		beforeEach(function() {
			req = {
				user: {
					_id: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
					username: "user",
					password: "pass",
					role: 1
				},
				race: race
			};
		});

		it("should return error 400 when database crash", function(done) {

			sandbox.stub(Race, "destroy", function(id, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.delete(req, res);

		});

		it("should return 400 userNotOwner", function(done) {

			//set different user id
			req.user._id = mongoose.Types.ObjectId("52a7082cad21354c23000002");

			sandbox.stub(Race, "destroy", function(id, cb) {
				cb(null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotOwner");
						done();
					}
				};
			};

			RaceController.delete(req, res);
		});

		it("should return 400 unknownRace", function(done) {

			//set race to undefined
			req.race = undefined;

			sandbox.stub(Race, "destroy", function(id, cb) {
				cb(null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownRace");
						done();
					}
				};
			};

			RaceController.delete(req, res);
		});

		it("should return 400 userNotConnected", function(done) {

			//set user to undefined
			req.user = undefined;

			sandbox.stub(Race, "destroy", function(id, cb) {
				cb(null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotConnected");
						done();
					}
				};
			};

			RaceController.delete(req, res);
		});

		it("should return 200", function(done) {

			sandbox.stub(Race, "destroy", function(id, cb) {
				cb(null);
			});

			res.sendStatus = function(httpStatus) {
				expect(httpStatus).to.equal(200);
				done();

			};

			RaceController.delete(req, res);
		});
	});

	describe("publish()", function() {

		beforeEach(function() {
			req = {
				params: {
					value: true
				},
				user: {
					_id: mongoose.Types.ObjectId("52a7082cad21354c23000001"),
					username: "user",
					password: "pass",
					role: 1
				},
				race: race
			};
		});

		it("should return error with 400 status", function(done) {

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.publish(req, res);

		});

		it("should return 400 userNotOwner", function(done) {

			//set different user id
			req.user._id = mongoose.Types.ObjectId("52a7082cad21354c23000002");

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb(null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotOwner");
						done();
					}
				};
			};

			RaceController.publish(req, res);
		});

		it("should return 400 unknownRace", function(done) {

			//set race to undefined
			req.race = undefined;

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb(null);
			});


			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.unknownRace");
						done();
					}
				};
			};

			RaceController.publish(req, res);
		});

		it("should return 400 userNotConnected", function(done) {

			//set user to undefined
			req.user = undefined;

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb(null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.userNotConnected");
						done();
					}
				};
			};

			RaceController.publish(req, res);
		});

		it("should return 200", function(done) {

			sandbox.stub(Race, "update", function(undefined, undefined, undefined, cb) {
				cb(null);
			});

			res.sendStatus = function(httpStatus) {
				expect(httpStatus).to.equal(200);
				done();

			};

			RaceController.publish(req, res);
		});
	});


	describe("search()", function() {

		beforeEach(function() {
			req = {
				body: {
					criteria: {
						fulltext: "dua",
						distance: undefined,
						searchAround: undefined,
						types: [],
						details: undefined,
						from: 0,
						size: 20,
						sort: "_score"
					}
				}
			};
		});

		it("should return error 400 when no criteria", function(done) {

			req.body.criteria = undefined;

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.noCriteria");
						done();
					}
				};
			};

			RaceController.search(req, res);

		});

		it("should return error 400 when elasticsearch crash", function(done) {

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.noData");
						done();
					}
				};
			};

			RaceController.search(req, res);

		});

		it("should return error 400 when elasticsearch crash", function(done) {


			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.search(req, res);

		});

		it("should return error 200 when criteria is empty", function(done) {

			var mockData = "true";
			req.body.criteria = {};

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, mockData);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data).to.equal(true);
						done();
					}
				};
			};

			RaceController.search(req, res);

		});

		it("should return error 200 when criteria is mode search by fulltext", function(done) {

			var mockData = "true";

			req = {
				body: {
					criteria: {
						fulltext: "dua",
						departments: ["11"],
						types: ["duathlon"],
						region: {
							name: "Ain",
							departments: ["67", "68"]
						},
						from: 0,
						size: 20,
						sort: "_score"
					}
				}
			};

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, mockData);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data).to.equal(true);
						done();
					}
				};
			};

			RaceController.search(req, res);

		});

		it("should return error 200 when criteria is mode search by geolocation", function(done) {

			var mockData = "true";

			req = {
				body: {
					criteria: {
						distance: 15,
						searchAround: true,
						location: {
							lat: 43.5,
							lon: 1.5
						},
						from: 0,
						size: 20,
						sort: "_score"
					}
				}
			};

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, mockData);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data).to.equal(true);
						done();
					}
				};
			};

			RaceController.search(req, res);

		});
	});

	describe("autocomplete()", function() {

		beforeEach(function() {
			req = {
				body: {
					criteria: {
						fulltext: "dua",
						region: {
							name: "Ain",
							departments: ["67", "68"]
						}
					}
				}
			};
		});

		it("should return error 400 when elasticsearch crash", function(done) {


			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.autocomplete(req, res);

		});

		it("should return error 400 when elasticsearch crash", function(done) {

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.noData");
						done();
					}
				};
			};

			RaceController.autocomplete(req, res);

		});

		it("should return error 400 when no criteria", function(done) {

			req.body.criteria = undefined;

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.noCriteria");
						done();
					}
				};
			};

			RaceController.autocomplete(req, res);

		});

		it("should return error 200", function(done) {

			var mockData = "true";

			sandbox.stub(ElasticSearchClient.prototype, "search", function(undefined, undefined, undefined, cb) {
				cb(null, mockData);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data).to.equal(true);
						done();
					}
				};


			};

			RaceController.autocomplete(req, res);

		});
	});

	describe("findAll()", function() {

		it("should return error 400 when database crash", function(done) {

			sandbox.stub(Race, "findAll", function(cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error");
						done();
					}
				};
			};

			RaceController.findAll(req, res);

		});

		it("should return error 400 when database return races undefined", function(done) {

			sandbox.stub(Race, "findAll", function(cb) {
				cb(null, null);
			});

			res.status = function(httpStatus) {
				return {
					json: function(err) {
						expect(httpStatus).to.equal(400);
						expect(err.message).to.be.an("array");
						expect(err.message[0]).to.equal("error.occured");
						done();
					}
				};
			};

			RaceController.findAll(req, res);

		});

		it("should return 200", function(done) {

			var mockRaces = [];
			mockRaces.push(race);

			sandbox.stub(Race, "findAll", function(cb) {
				cb(null, mockRaces);
			});

			res.status = function(httpStatus) {
				return {
					json: function(data) {
						expect(httpStatus).to.equal(200);
						expect(data.races).to.be.an("array");
						expect(data.races[0]).to.equal(mockRaces[0]);
						done();
					}
				};
			};

			RaceController.findAll(req, res);

		});
	});

});