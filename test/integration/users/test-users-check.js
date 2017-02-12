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
 * Check User tests
 */
describe('Check user: POST /users/check/email', function() {


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

  describe('Email Already Exists', function() {



    it('should response email Already Exists', function(done) {
      superagent.post('http://localhost:3000/users/check/email')
        .send({
          user: {
            email: 'foobar@example.com'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailAlreadyExists");
          done();
        });
    });


  });



  describe('Email Valid', function() {

    it('should response success', function(done) {
      superagent.post('http://localhost:3000/users/check/email')
        .send({
          user: {
            email: 'hello@example.com'
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