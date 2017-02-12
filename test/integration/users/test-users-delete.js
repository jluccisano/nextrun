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
 * Delete user tests

describe('Delete User: DELETE /users', function() {

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

  it('Authenticate user should response success', function(done) {
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

  describe('Delete user failed', function() {

    it('should response unknown id', function(done) {
      superagent.del('http://localhost:3000/users/1234')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownId");
          done();
        });
    });

    it('should response unknown id', function(done) {
      superagent.del('http://localhost:3000/users/523726537a11c4aa8d789bbb')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownId");
          done();
        });
    });

    it('should response error user unknown', function(done) {
      superagent.post('http://localhost:3000/users/session')
        .send({
          email: 'foobar@example.com',
          password: 'foobar'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidEmailOrPassword");
          done();
        });
    });

  });

  describe('Delete user success', function() {

    it('should response delete account success', function(done) {
      superagent.del('http://localhost:3000/users/' + currentUser._id)
        .send()
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
 */