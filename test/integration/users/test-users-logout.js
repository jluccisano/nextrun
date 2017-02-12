process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  app = require('../../../server'),
  context = describe,
  superagent = require('superagent'),
  userRoles = require('../../../public/js/client/routingConfig').userRoles,
  passportStub = require('passport-stub'),
  User = mongoose.model('User');

passportStub.install(app);
/**
 * Log Out User tests
 */
var user1 = {
  username: 'foobar1',
  email: "foobar1@example.com",
  role: {
    bitMask: 2,
    title: 'user'
  },
  _id: '123726537a11c4aa8d789bbc',
  password: '123'
};

describe('Log Out User: GET /api/users/logout', function() {

  before(function(done) {
    User.create(user1, function(err, user) {
      user1._id = user._id;
      done();
    });
  });


  it('should save the user 1 to the database', function(done) {
    User.findOne({
      email: 'foobar1@example.com'
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal('foobar1@example.com');
      done();
    });
  });


  describe('log out failed user not authenticated', function() {

    it('should logout failed', function(done) {
      superagent.post('http://localhost:3000/api/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(403);
          res.body.message[0].should.equal("error.accessDenied");
          done();
        });
    });
  });

  describe('log out success', function() {

    it('should logout successfully', function(done) {
      passportStub.login(user1);
      superagent.post('http://localhost:3000/api/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          passportStub.logout(user1);
          done();
        });
    });
  });

  after(function(done) {
    User.remove({}, function() {
      done();
    });
  });

});