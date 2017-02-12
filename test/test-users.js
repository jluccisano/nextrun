process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , app = require('../server')
  , context = describe
  , superagent = require('superagent')
  , User = mongoose.model('User');

var cookies, count;

/**
 * Users tests
 */

describe('Users', function () {
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('no email - should respond with errors', function (done) {
       superagent.post('http://localhost:3000/users')
        .send({ username:'foobar', email: '', password: 'foobar' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.errors.email.message.should.equal("error.emailCannotBeBlank");
           done();
        });
      });

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt)
          done()
        })
      })
    })

	describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done();
        })
      })

      it('should response success', function (done) {
       superagent.post('http://localhost:3000/users')
        .send({ username:'foobar', email: 'foobar@example.com', password: 'foobar' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("success");
           done();
        });
      });

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1)
          done();
        })
      })

      it('should save the user to the database', function (done) {
        User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          done();
        });
      });
    });

    after(function(done){
      User.remove({}, function(){
        done();
      });
    });

  });


  describe('POST /users/session', function () {
    describe('Authenticate success', function () {

      var currentUser;

      before(function (done) {
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar"} , function(err,user){
          currentUser = user;
          done();        
        });
      });

      it('should save the user to the database', function (done) {
        User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          done();
        });
      });

      it('should response success', function (done) {
       superagent.post('http://localhost:3000/users/session')
        .send({ email: 'foobar@example.com', password: 'foobar' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("success");
           done();
        });
      });

      it('should response invalidEmailOrPassword', function (done) {
       superagent.post('http://localhost:3000/users/session')
        .send({ email: 'foobar@example.com', password: 'badpassword' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.message.should.equal("error.invalidEmailOrPassword");
           done();
        });
      });
    });

    after(function(done){
      User.remove({}, function(){
        done();
      });
    });
  });

  describe('POST /users/forgotpassword', function () {

    var currentUser;

    before(function (done) {
      User.create({ username: "foobar", email:"foobar@example.com", password:"foobar"} , function(err,user){
        currentUser = user;
        done();        
      });
    });

    describe('Invalid Parameters', function () {

      it('should save the user to the database', function (done) {
        User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          done();
        });
      });

      it('should failed cause email unknown', function (done) {
       superagent.post('http://localhost:3000/users/forgotpassword')
        .send({ email: 'toto@example.com' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("error.invalidEmail");
           done();
        });
      });

      it('should failed cause email cannot be blank', function (done) {
       superagent.post('http://localhost:3000/users/forgotpassword')
        .send({ email: '' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("error.invalidEmail");
           done();
        });
      });

      it('should failed cause email is required', function (done) {
       superagent.post('http://localhost:3000/users/forgotpassword')
        .send({})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("error.invalidEmail");
           done();
        });
      });
    });

    describe('Valid Parameters', function () {

      it('should save the user to the database', function (done) {
        User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          done();
        });
      });

      it('should response success', function (done) {
       superagent.post('http://localhost:3000/users/forgotpassword')
        .send({ email: 'foobar@example.com' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("success");
           done();
        });
      });

    });

    after(function(done){
      User.remove({}, function(){
        done();
      });
    });
  });

  describe('GET /logout', function () {
    describe('test logout', function () {

      var currentUser;

      before(function (done) {
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar"} , function(err,user){
          currentUser = user;
          done();        
        });
      });

      it('should save the user to the database', function (done) {
        User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          done();
        });
      });

      it('Authenticate should response success', function (done) {
       superagent.post('http://localhost:3000/users/session')
        .send({ email: 'foobar@example.com', password: 'foobar' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.response.should.equal("success");
           done();
        });
      });

      it('should logout successfully', function (done) {
       superagent.get('http://localhost:3000/logout')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           console.log(res.req);
           res.redirects.should.eql(["http://localhost:3000/"]);
           done();
        });
      });
    });

    after(function(done){
      User.remove({}, function(){
        done();
      });
    });
  });

});