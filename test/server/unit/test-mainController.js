/**
	describe("function()", function() {

		it("should return OK", function(done) {

		});

		it("should return NOK", function(done) {

		});
	});
**/

process.env.NODE_ENV = "test";
process.env.PORT= 4000;

var chai = require("chai"),
	sinon = require("sinon"),
	sinonChai = require("sinon-chai"),
	MainController = require("../../../server/controllers/mainController");

chai.use(sinonChai);


var sandbox = sinon.sandbox.create();

afterEach(function() {
	sandbox.restore();
});

describe("MainController", function() {

});