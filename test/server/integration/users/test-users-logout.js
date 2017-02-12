process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  app = require('../../../../server'),
  context = describe,
  request = require('superagent'),
  userRoles = require('../../../../public/js/routingConfig').userRoles,
  User = mongoose.model('User'),
  superagent = request.agent(app);

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

    before(function(done) {
      superagent.post('http://localhost:3000/api/users/session')
        .send({
          email: 'foobar1@example.com',
          password: '123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar1");
          res.body.role.title.should.equal("user");
          done();
        });
    });

    it('should logout successfully', function(done) {
      superagent.post('http://localhost:3000/api/users/logout')
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