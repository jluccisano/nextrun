process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  app = require('../../../../server'),
  context = describe,
  superagent = require('superagent'),
  userRoles = require('../../../../public/js/routingConfig').userRoles,
  User = mongoose.model('User');

/**
 * Forgot Password tests
 */

describe('Forgot Password: POST /api/users/forgotpassword', function() {

  before(function(done) {
    User.remove({}, function() {
      done();
    });
  });


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

  describe('Invalid Parameters', function() {

    it('should failed cause email unknown', function(done) {
      superagent.post('http://localhost:3000/api/users/forgotpassword')
        .send({
          user: {
            email: 'toto@example.com'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidEmail");
          done();
        });
    });

    it('should failed cause email cannot be blank', function(done) {
      superagent.post('http://localhost:3000/api/users/forgotpassword')
        .send({
          user: {
            email: ''
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidEmail");
          done();
        });
    });

    it('should failed cause email is required', function(done) {
      superagent.post('http://localhost:3000/api/users/forgotpassword')
        .send({
          user: {}
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidEmail");
          done();
        });
    });
  });

  describe('Valid Parameters', function() {

    it('should response success', function(done) {
      superagent.post('http://localhost:3000/api/users/forgotpassword')
        .send({
          user: {
            email: 'foobar@example.com'
          }
        })
        .set('Accept', 'application/json')
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