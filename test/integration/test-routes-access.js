process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  should = require('should'),
  superagent = require('superagent'),
  app = require('../../server'),
  passportStub = require('passport-stub');

passportStub.install(app);

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

describe('Server Integration Tests - ', function (done) {
    afterEach(function() {
        passportStub.logout(); // logout after each test
    });
    it('Homepage - Return a 200', function(done) {
        superagent.get('http://localhost:3000/')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });
    it('Logout with Return a 403', function(done) {
        superagent.post('http://localhost:3000/api/users/logout')
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
