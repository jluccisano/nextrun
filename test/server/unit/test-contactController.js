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

var mongoose = require("mongoose"),
	chai = require("chai"),
	expect = chai.expect,
	sinon = require("sinon"),
	sinonChai = require("sinon-chai"),
	app = require("../../../server"),
	ContactController = require("../../../server/controllers/contactController"),
	Contact = mongoose.model("Contact"),
	Schema = mongoose.Schema,
	email = require("../../../config/middlewares/notification");

chai.use(sinonChai);


var req = {},
	res = {},
	next = function() {},
	sandbox = sinon.sandbox.create();

var contact = {
	email: "foobar@example.com",
	type: "athlete"
}

afterEach(function() {
	sandbox.restore();
});

describe("ContactController", function() {

	describe("create()", function() {

		beforeEach(function() {
			req = {
				body: {
					email: "foobar@example.com",
					type: "athlete"
				}
			};
		});

		it("should return a 400 when no body", function(done) {

			req.body = undefined;

			var emailStub = sandbox.stub(email, "sendEmailNewContact").returns();

			sandbox.stub(Contact.prototype, "save", function(cb) {
				cb(null);
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an("array");
				expect(err.message[0]).to.equal("error.bodyParamRequired");
				done();
			};

			ContactController.create(req, res);
		});

		it("should return a 400 when database crash", function(done) {

			var emailStub = sandbox.stub(email, "sendEmailNewContact").returns();

			sandbox.stub(Contact.prototype, "save", function(cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an("array");
				expect(err.message[0]).to.equal("error");
				done();
			};

			ContactController.create(req, res);
		});

		it("should return a 200 when contact was created successfully", function(done) {

			var emailStub = sandbox.stub(email, "sendEmailNewContact").returns();

			sandbox.stub(Contact.prototype, "save", function(cb) {
				cb(null);
			});

			res.json = function(httpStatus, data) {
				expect(httpStatus).to.equal(200);
				done();
			};

			ContactController.create(req, res);
		});
	});

	describe("feedback()", function() {

		beforeEach(function() {
			req = {
				body: {
					feedback: {
						email: "foobar@example.com"
					}
				}
			};
		});

		it("should return a 400 when feedback is undefined", function(done) {

			req.body = undefined;

			var emailStub = sandbox.stub(email, "sendEmailNewFeedback").returns();

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an("array");
				expect(err.message[0]).to.equal("error.occured");
				done();
			};

			ContactController.feedback(req, res);
		});

		it("should return a 200 when feedback was send successfully", function(done) {

			var emailStub = sandbox.stub(email, "sendEmailNewFeedback").returns();

			res.json = function(httpStatus, data) {
				expect(httpStatus).to.equal(200);
				done();
			};

			ContactController.feedback(req, res);
		});
	});

});