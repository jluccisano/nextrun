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
 * Update User tests
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

var user2 = {
  username: 'foobar2',
  email: "foobar2@example.com",
  role: {
    bitMask: 2,
    title: 'user'
  },
  _id: '223726537a11c4aa8d789bbc',
  password: '123'
};

describe('Update User: PUT /users/update', function() {



  describe('PUT /users/update/profile', function() {

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

    describe('Invalid Parameters', function() {

      it('should response access denied', function(done) {
        superagent.put('http://localhost:3000/users/update/profile')
          .send()
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(403);
            res.body.message[0].should.equal("error.accessDenied");
            done();
          });
      });
    });

    describe('Valid Parameters', function() {

      it('should response success', function(done) {
        passportStub.login(user1);
        superagent.put('http://localhost:3000/users/update/profile')
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


  describe('PUT /users/update/password', function() {

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

    describe('Invalid Parameters', function() {

      it('should response access denied', function(done) {
        superagent.put('http://localhost:3000/users/update/password')
          .send()
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(403);
            res.body.message[0].should.equal("error.accessDenied");
            done();
          });
      });

      it('should response invalid password', function(done) {
        passportStub.login(user1);
        superagent.put('http://localhost:3000/users/update/password/')
          .send({
            actual: "foobar3",
            new: "foobar2"
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.invalidPassword");
            passportStub.logout(user1);
            done();
          });
      });
    });

    describe('Update user password', function() {

      it('should response update password success', function(done) {
        passportStub.login(user1);
        superagent.put('http://localhost:3000/users/update/password/')
          .send({
            actual: "foobar",
            new: "foobar2"
          })
          .set('Accept', 'application/json')
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


});