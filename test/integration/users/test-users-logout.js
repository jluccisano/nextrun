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
  User = mongoose.model('User');


/**
 * Log Out User tests
 */
describe('Log Out User: GET /logout', function() {

  var currentUser;

  before(function(done) {
    User.create({
      username: "foobar",
      email: "foobar@example.com",
      password: "foobar",
      role: userRoles.user
    }, function(err, user) {
      currentUser = user;
      done();
    });
  });

  describe('log out failed user not authenitcated', function() {

    it('check if user has been saved to the database', function(done) {
      User.findOne({
        email: 'foobar@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        user.email.should.equal('foobar@example.com');
        done();
      });
    });

    it('should logout failed', function(done) {
      superagent.post('http://localhost:3000/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('log out success', function() {

    it('check if user has been saved to the database', function(done) {
      User.findOne({
        email: 'foobar@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        user.email.should.equal('foobar@example.com');
        done();
      });
    });

    it('Authenticate should response success', function(done) {
      superagent.post('http://localhost:3000/users/session')
        .send({
          email: 'foobar@example.com',
          password: 'foobar'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar");
          res.body.role.title.should.equal("user");
          done();
        });
    });

    it('should logout successfully', function(done) {
      superagent.post('http://localhost:3000/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
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