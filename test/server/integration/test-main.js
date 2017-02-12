process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  request = require('superagent'),
  app = require('../../../server'),
  context = describe,
  superagent = request.agent(app),
  userRoles = require('../../../public/js/routingConfig').userRoles,
  User = mongoose.model('User');

/**
 * Create contact tests
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

describe('Test partials view: GET /partials/*', function() {

  before(function(done) {
    User.remove({}, function() {
      done();
    });
  });


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

  describe('test set cookie', function() {

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

    it('get index', function(done) {
      superagent.get('http://localhost:3000/')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    after(function(done) {
      superagent.post('http://localhost:3000/api/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

  });

  describe('Valid parameters', function() {

    it('get view', function(done) {
      superagent.get('http://localhost:3000/partials/home')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    it('get view with sub type ', function(done) {
      superagent.get('http://localhost:3000/partials/race/create')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    it('get index', function(done) {
      superagent.get('http://localhost:3000/')
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