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
	UserController = require('../../../app/controllers/userController'),
	User = mongoose.model('User'),
	Schema = mongoose.Schema,
	passport = require('passport'),
	email = require('../../../config/middlewares/notification');

chai.use(sinonChai);


var req = {},
	res = {},
	sandbox = sinon.sandbox.create();

afterEach(function() {
	sandbox.restore();
});

describe('UserController', function() {

	describe('login()', function() {

		beforeEach(function() {
			req = {
				body: {
					user: {
						email: 'foobar@example.com',
						password: 'foobar'
					}
				}
			};
		});

		/*it('should return a 400 when database crash', function(done) {

			//sandbox.stub(passport, 'authenticate').returns();

			sandbox.stub(passport, 'authenticate', function(cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, new User(), "error");
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err).to.equal('error');
				done();
			};

			UserController.login(req, res);

			//done();
		});*/
	});

	describe('logout()', function() {

		it('should return OK', function(done) {

			req.logout = function() {
				return true;
			};

			res.send = function(httpStatus) {
				expect(httpStatus).to.equal(200);
				done();
			};

			UserController.logout(req, res);

		});

	});

	describe('signup()', function() {

		beforeEach(function() {
			req = {
				body: {
					user: {
						username: 'foobar',
						email: 'foobar@example.com',
						password: 'foobar'
					}
				}
			};
		});

		it('should return a 400 when bodyParamRequired', function(done) {

			req.body = undefined;

			sandbox.stub(User.prototype, 'save', function(cb) {
				cb(null, null);
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal('error.bodyParamRequired');
				done();
			};

			UserController.signup(req, res);
		});

		it('should return a 400 when database crash', function(done) {

			sandbox.stub(User.prototype, 'save', function(cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal('error');
				done();
			};

			UserController.signup(req, res);
		});


		it('should return a 400 when req.logIn failed', function(done) {

			sandbox.stub(User.prototype, 'save', function(cb) {
				cb(null);
			});

			req.logIn = function(user, cb) {
				return cb({
					"errors": [{
						"message": "error"
					}]
				});
			};

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal('error');
				done();
			};

			UserController.signup(req, res);
		});

		it('should return 200 when user is created successfully', function(done) {

			sandbox.stub(User.prototype, 'save', function(cb) {
				cb(null);
			});

			req.logIn = function(user, cb) {
				return cb(null);
			};

			res.json = function(httpStatus, data) {
				expect(httpStatus).to.equal(200);
				expect(data.username).to.equal(req.body.user.username);
				expect(data.email).to.equal(req.body.user.email);

				done();
			};

			UserController.signup(req, res);
		});
	});

	describe('forgotpassword()', function() {

		beforeEach(function() {
			req = {
				body: {
					user: {
						username: 'foobar',
						email: 'foobar@example.com',
						password: 'foobar'
					}
				}
			};
		});

		it('should return error 400 when body param is not set', function(done) {

			req.body.user = undefined;

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.bodyParamRequired");
				done();
			};

			UserController.forgotPassword(req, res);

		});

		it('should return error 400 and invalid email', function(done) {

			req.body.user.email = undefined;

			sandbox.stub(User, 'findOne', function(undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.invalidEmail");
				done();
			};

			UserController.forgotPassword(req, res);

		});

		it('should return error 400 database crash', function(done) {

			sandbox.stub(User, 'findOne', function(undefined, cb) {
				cb(null, new User());
			});

			sandbox.stub(User, 'update', function(undefined, undefined, undefined, cb) {
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

			UserController.forgotPassword(req, res);

		});

		it('should return 200', function(done) {

			sandbox.stub(email, 'sendEmailPasswordReinitialized').returns();

			sandbox.stub(User, 'findOne', function(undefined, cb) {
				cb(null, new User());
			});

			sandbox.stub(User, 'update', function(undefined, undefined, undefined, cb) {
				cb(null);
			});


			res.json = function(httpStatus) {
				expect(httpStatus).to.equal(200);
				done();
			};

			UserController.forgotPassword(req, res);

		});
	});

	describe('settings()', function() {

		beforeEach(function() {
			req = {
				user: {
					_id: 1,
					username: 'foobar',
					email: 'foobar@example.com',
				}
			};
		});

		it('should return error 400 when userNotConnected', function(done) {

			req.user = undefined;

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.userNotConnected");
				done();
			};

			UserController.settings(req, res);

		});

		it('should return error 200', function(done) {


			res.json = function(httpStatus, data) {
				expect(httpStatus).to.equal(200);
				expect(data.user._id).to.equal(req.user._id);
				expect(data.user.username).to.equal(req.user.username);
				expect(data.user.email).to.equal(req.user.email);
				done();
			};

			UserController.settings(req, res);

		});


	});

	describe('checkIfEmailAlreadyExists()', function() {

		beforeEach(function() {
			req = {
				body: {
					user: {
						username: 'foobar',
						email: 'foobar@example.com',
						password: 'foobar'
					}
				}
			};
		});

		it('should return error 400 when bodyParamRequired', function(done) {

			req.body.user = undefined;

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.bodyParamRequired");
				done();
			};

			UserController.checkIfEmailAlreadyExists(req, res);

		});

		it('should return error 400 when database crash', function(done) {

			sandbox.stub(User, 'findOne', function(undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				}, null);
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error");
				done();
			};

			UserController.checkIfEmailAlreadyExists(req, res);

		});

		it('should return error 400 when emailAlreadyExists', function(done) {

			sandbox.stub(User, 'findOne', function(undefined, cb) {
				cb(null, new User());
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.emailAlreadyExists");
				done();
			};

			UserController.checkIfEmailAlreadyExists(req, res);

		});

		it('should return 200', function(done) {

			sandbox.stub(User, 'findOne', function(undefined, cb) {
				cb(null, null);
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(200);
				done();
			};

			UserController.checkIfEmailAlreadyExists(req, res);

		});



	});

	describe('updatePassword()', function() {

		beforeEach(function() {
			req = {
				body: {
					actual: '123',
					new: '234'
				},
				user: new User({
					username: 'foobar',
					email: 'foobar@example.com',
					password: 'foobar'
				})
			};
		});

		it('should return error 400 when user is not connected', function(done) {

			req.user = undefined;

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.userNotConnected");
				done();
			};

			UserController.updatePassword(req, res);

		});

		it('should return error 400 when bodyParamRequired', function(done) {

			req.body.actual = undefined;

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.bodyParamRequired");
				done();
			};

			UserController.updatePassword(req, res);

		});

		it('should return error 400 when invalidPassword', function(done) {

			sandbox.stub(req.user, 'authenticate').returns(false);

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.invalidPassword");
				done();
			};

			UserController.updatePassword(req, res);

		});

		it('should return error 400 when invalidPassword', function(done) {

			sandbox.stub(req.user, 'authenticate').returns(true);

			sandbox.stub(User, 'update', function(undefined, undefined, undefined, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});


			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal("error.occured");
				done();
			};

			UserController.updatePassword(req, res);

		});

		it('should return error 200', function(done) {

			sandbox.stub(req.user, 'authenticate').returns(true);

			sandbox.stub(User, 'update', function(undefined, undefined, undefined, cb) {
				cb(null);
			});


			res.json = function(httpStatus) {
				expect(httpStatus).to.equal(200);
				done();
			};

			UserController.updatePassword(req, res);

		});
	});



	describe('deleteAccount()', function() {

		beforeEach(function() {
			req = {
				user: {
					_id: 1,
					username: "user",
					password: "pass",
					role: 1
				}
			};
		});

		it('should return a 400 when user delete fails', function(done) {

			sandbox.stub(User, 'destroy', function(id, cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal('error');
				done();
			};

			UserController.deleteAccount(req, res);
		});

		it('should return a 200 with a username and role in the response body', function(done) {

			sandbox.stub(User, 'destroy', function(id, cb) {
				cb(null);
			});

			req.logout = function() {
				return true;
			};

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(200);
				done();
			};

			UserController.deleteAccount(req, res);
		});

	});


	describe('updateProfile()', function() {

		beforeEach(function() {
			req = {
				body: {
					user: {
						_id: '123726537a11c4aa8d789bbc',
						username: "user",
						password: "pass",
						email: "user_updated@gmail.com",
						role: 1
					}
				}
			};
		});

		it('should return a 400 when user update fails', function(done) {

			var userToUpdate = new User(req.body.user);

			req.user = new User({
				_id: '123726537a11c4aa8d789bbc',
				username: "user",
				password: "pass",
				role: 1,
				email: "user@gmail.com"
			});

			sandbox.stub(req.user, 'save', function(cb) {
				cb({
					"errors": [{
						"message": "error"
					}]
				});
			});

			res.json = function(httpStatus, err) {
				expect(httpStatus).to.equal(400);
				expect(err.message).to.be.an('array');
				expect(err.message[0]).to.equal('error');
				done();
			};

			UserController.updateProfile(req, res);
		});

		it('should return a 200 with a username and email in the response body', function(done) {

			var userToUpdate = new User(req.body.user);

			req.user = new User({
				_id: '123726537a11c4aa8d789bbc',
				username: "user",
				password: "pass",
				role: 1,
				email: "user@gmail.com"
			});

			sandbox.stub(req.user, 'save', function(cb) {
				cb(null);
			});

			res.json = function(httpStatus, user) {
				expect(httpStatus).to.equal(200);
				expect(req.body.email).to.equal(user.email);
				done();
			};

			UserController.updateProfile(req, res);
		});

	});

});