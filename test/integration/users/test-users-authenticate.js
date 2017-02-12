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
 * Autheniticate User tests
 */

describe('Authenticate user: POST /users/session', function() {


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

  describe('Authenticate failed', function() {

    it('should response invalidEmailOrPassword', function(done) {
      superagent.post('http://localhost:3000/users/session')
        .send({
          email: 'foobar@example.com',
          password: 'badpassword'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidEmailOrPassword");
          done();
        });
    });

    it('should response Missing Credentials', function(done) {
      superagent.post('http://localhost:3000/users/session')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message.should.equal("Missing credentials");
          done();
        });
    });
  });

  describe('Authenticate success', function() {

    it('should response success', function(done) {
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
  });

  after(function(done) {
    User.remove({}, function() {
      done();
    });
  });



});