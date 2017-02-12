process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require("sinon-chai"),
	app = require('../../server'),
	UserController = require('../../app/controllers/userController'),
	User = mongoose.model('User');

chai.use(sinonChai);


var req = {},
	res = {},
	sandbox = sinon.sandbox.create();

afterEach(function() {
	sandbox.restore();
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