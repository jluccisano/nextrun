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
 * Update User tests

describe('Update User: PUT /users/:userId/update', function() {


  describe('PUT /users/:userId/update/profile', function() {

    var currentUser;

    before(function(done) {
      var userArray = [{
        username: "foobar",
        email: "foobar@example.com",
        password: "foobar",
        role: userRoles.user
      }, {
        username: "foobar2",
        email: "foobar2@example.com",
        password: "foobar2",
        role: userRoles.user
      }];
      User.create(userArray, function(err, user) {
        currentUser = user;
        done();
      });
    });

    it('should save the user 1 to the database', function(done) {
      User.findOne({
        email: 'foobar@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        user.email.should.equal('foobar@example.com');
        done();
      });
    });

    it('should save the user 2 to the database', function(done) {
      User.findOne({
        email: 'foobar2@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        user.email.should.equal('foobar2@example.com');
        done();
      });
    });

    describe('Invalid Parameters', function() {

      it('should response user not found', function(done) {
        superagent.put('http://localhost:3000/users/1234/update/profile')
          .send({
            user: {
              email: 'foobar@example.com',
              username: 'hello'
            }
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.unknownId");
            done();
          });
      });

      it('should response user not found', function(done) {
        superagent.put('http://localhost:3000/users/523726537a11c4aa8d789bbb/update/profile')
          .send({
            user: {
              email: 'foobar@example.com',
              username: 'hello'
            }
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.unknownId");
            done();
          });
      });

      it('no email - should response user not found', function(done) {
        superagent.put('http://localhost:3000/users/523726537a11c4aa8d789bbb/update/profile')
          .send({
            user: {
              username: 'hello'
            }
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.unknownId");
            done();
          });
      });

      it('no body - should response user not found', function(done) {
        superagent.put('http://localhost:3000/users/523726537a11c4aa8d789bbb/update/profile')
          .send()
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.unknownId");
            done();
          });
      });

    });

    describe('Valid Parameters', function() {

      it('should response success', function(done) {
        superagent.put('http://localhost:3000/users/' + currentUser._id + '/update/profile')
          .send({
            user: {
              email: 'hello@example.com',
              username: 'hello'
            }
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.body.user.username.should.equal("hello");
            res.body.user.email.should.equal("hello@example.com");
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


  describe('PUT /users/:userId/update/password', function() {

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

    it('should save the user to the database', function(done) {
      User.findOne({
        email: 'foobar@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        user.email.should.equal('foobar@example.com');
        done();
      });
    });

    describe('Invalid Password', function() {

      it('should response invalid password', function(done) {
        superagent.put('http://localhost:3000/users/' + currentUser._id + '/update/password/')
          .send({
            actual: "foobar3",
            new: "foobar2"
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.invalidPassword");
            done();
          });
      });
    });

    describe('Update user password', function() {

      it('should response update password success', function(done) {
        superagent.put('http://localhost:3000/users/' + currentUser._id + '/update/password/')
          .send({
            actual: "foobar",
            new: "foobar2"
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


});
 */