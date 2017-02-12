process.env.NODE_ENV = "test";
process.env.PORT = 4000;

/**
 * Module dependencies.
 */
var chai = require("chai"),
	expect = chai.expect,
	sinon = require("sinon"),
	sinonChai = require("sinon-chai"),
	email = require("../../../server/middlewares/notification"),
	nodemailer = require("nodemailer");

chai.use(sinonChai);

var contact = {},
	sandbox = sinon.sandbox.create();

afterEach(function() {
	sandbox.restore();
});

describe("Notification", function() {

	describe("sendEmailNewContact()", function() {

		beforeEach(function() {
			contact = {
				email: "foobar@example.com",
				type: "athlete"
			};
		});

		it("should not send email when framework failed", function(done) {

			var transportMock = nodemailer.createTransport("SMTP", {
				service: "Mailgun",
				auth: {
					user: "toto",
					pass: "titi"
				}
			});

			sandbox.stub(nodemailer, "createTransport").returns(transportMock);

			var nodeMailerStub = sandbox.stub(transportMock, "sendMail", function(undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);

			});

			email.sendEmailNewContact(contact);

			expect(nodeMailerStub.calledOnce).to.be.true;

			done();
		});

		it("should send email", function(done) {

			var transportMock = nodemailer.createTransport("SMTP", {
				service: "Mailgun",
				auth: {
					user: "toto",
					pass: "titi"
				}
			});

			sandbox.stub(nodemailer, "createTransport").returns(transportMock);

			var nodeMailerStub = sandbox.stub(transportMock, "sendMail", function(undefined, cb) {
				cb(null, null);

			});

			email.sendEmailNewContact(contact);

			expect(nodeMailerStub.calledOnce).to.be.true;

			done();
		});
	});

	describe("sendEmailPasswordReinitialized()", function() {

		beforeEach(function() {
			contact = {
				email: "foobar@example.com",
				type: "athlete"
			};
		});

		it("should not send email when framework failed", function(done) {

			var transportMock = nodemailer.createTransport("SMTP", {
				service: "Mailgun",
				auth: {
					user: "toto",
					pass: "titi"
				}
			});

			sandbox.stub(nodemailer, "createTransport").returns(transportMock);

			var nodeMailerStub = sandbox.stub(transportMock, "sendMail", function(undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);

			});

			email.sendEmailPasswordReinitialized(contact);

			expect(nodeMailerStub.calledOnce).to.be.true;

			done();
		});

		it("should send email", function(done) {

			var transportMock = nodemailer.createTransport("SMTP", {
				service: "Mailgun",
				auth: {
					user: "toto",
					pass: "titi"
				}
			});

			sandbox.stub(nodemailer, "createTransport").returns(transportMock);

			var nodeMailerStub = sandbox.stub(transportMock, "sendMail", function(undefined, cb) {
				cb(null, null);

			});

			email.sendEmailPasswordReinitialized(contact);

			expect(nodeMailerStub.calledOnce).to.be.true;

			done();
		});
	});

	describe("sendEmailNewFeedback()", function() {

		beforeEach(function() {
			contact = {
				email: "foobar@example.com",
				type: "athlete"
			};
		});

		it("should not send email when framework failed", function(done) {

			var transportMock = nodemailer.createTransport("SMTP", {
				service: "Mailgun",
				auth: {
					user: "toto",
					pass: "titi"
				}
			});

			sandbox.stub(nodemailer, "createTransport").returns(transportMock);

			var nodeMailerStub = sandbox.stub(transportMock, "sendMail", function(undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);

			});

			email.sendEmailNewFeedback(contact);

			expect(nodeMailerStub.calledOnce).to.be.true;

			done();
		});

		it("should send email", function(done) {

			var transportMock = nodemailer.createTransport("SMTP", {
				service: "Mailgun",
				auth: {
					user: "toto",
					pass: "titi"
				}
			});

			sandbox.stub(nodemailer, "createTransport").returns(transportMock);

			var nodeMailerStub = sandbox.stub(transportMock, "sendMail", function(undefined, cb) {
				cb(null, null);

			});

			email.sendEmailNewFeedback(contact);

			expect(nodeMailerStub.calledOnce).to.be.true;

			done();
		});
	});

});