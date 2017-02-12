process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
	sinon = require('sinon'),
	app = require('../../server'),
	UserController = require('../../app/controllers/userController'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');


var req = {},
	res = {},
	sandbox = sinon.sandbox.create();


describe('signup()', function() {

	beforeEach(function() {
		req.body = {
			username: "user",
			password: "pass",
			role: 1
		};
	});

	it('should return a 400 when user validation fails', function(done) {

		var userValidateStub = sandbox.stub(User, 'save').throws();


		res.send = function(httpStatus) {
			expect(httpStatus).to.equal(400);
			done();
		};

		UserController.signup(req, res);
	});

});