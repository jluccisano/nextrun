process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , app = require('../server')
  , context = describe
  , superagent = require('superagent')
  , userRoles = require('../public/js/client/routingConfig').userRoles
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
       superagent.post('http://localhost:3000/users/signup')
        .send({user: { username:'foobar', email: '', password: 'foobar' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message[0].should.equal("error.emailCannotBeBlank");
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
       superagent.post('http://localhost:3000/users/signup')
        .send({user: { username:'foobar', email: 'foobar@example.com', password: 'foobar' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.username.should.equal("foobar");
           res.body.role.title.should.equal("user");
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
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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
           res.body.username.should.equal("foobar");
           res.body.role.title.should.equal("user");
           done();
        });
      });

      it('should response invalidEmailOrPassword', function (done) {
       superagent.post('http://localhost:3000/users/session')
        .send({ email: 'foobar@example.com', password: 'badpassword' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.invalidEmailOrPassword");
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
      User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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
        .send({user: { email: 'toto@example.com' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.invalidEmail");
           done();
        });
      });

      it('should failed cause email cannot be blank', function (done) {
       superagent.post('http://localhost:3000/users/forgotpassword')
        .send({user: { email: '' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.invalidEmail");
           done();
        });
      });

      it('should failed cause email is required', function (done) {
       superagent.post('http://localhost:3000/users/forgotpassword')
        .send({user: {}})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.invalidEmail");
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
        .send({user:{ email: 'foobar@example.com' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
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
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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
           res.body.username.should.equal("foobar");
           res.body.role.title.should.equal("user");
           done();
        });
      });

      it('should logout successfully', function (done) {
       superagent.post('http://localhost:3000/users/logout')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
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


  describe('PUT /users/:userId/update/profile', function () {
    describe('Change Profile', function () {

      var currentUser;

      before(function (done) {
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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

      it('should response email Already Exists', function (done) {
       superagent.put('http://localhost:3000/users/'+currentUser._id+'/update/profile')
        .send({user: { email: 'foobar@example.com', username: 'hello' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.emailAlreadyExists");
           done();
        });
      });

      it('should response success', function (done) {
        superagent.put('http://localhost:3000/users/'+currentUser._id+'/update/profile')
        .send({user: { email: 'hello@example.com', username: 'hello' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           res.body.user.username.should.equal("hello");
           res.body.user.email.should.equal("hello@example.com");
           done();
        });
      });

      it('should response user not found', function (done) {
       superagent.put('http://localhost:3000/users/'+currentUser._id+'/update/profile')
        .send({user: { email: 'foobar@example.com', username: 'hello' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.unknownId");
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

 describe('POST /users/check/email', function () {
    describe('Check user email', function () {

      var currentUser;

      before(function (done) {
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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

      it('should response email Already Exists', function (done) {
       superagent.post('http://localhost:3000/users/check/email')
        .send({user: { email: 'foobar@example.com' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.emailAlreadyExists");
           done();
        });
      });

      it('should response success', function (done) {
       superagent.post('http://localhost:3000/users/check/email')
        .send({user: { email: 'hello@example.com' }})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
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

  describe('DELETE /users', function () {
    describe('Delete user account', function () {

      var currentUser;

      before(function (done) {
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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
           res.body.username.should.equal("foobar");
           res.body.role.title.should.equal("user");
           done();
        });
      });

      it('should response delete account success', function (done) {
       superagent.del('http://localhost:3000/users/'+currentUser._id)
        .send()
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           done();
        });
      });

      it('should response unknown id', function (done) {
       superagent.del('http://localhost:3000/users/1234')
        .send()
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.unknownId");
           done();
        });
      });

      it('should response unknown id', function (done) {
       superagent.del('http://localhost:3000/users/523726537a11c4aa8d789bbb')
        .send()
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.unknownId");
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

  describe('PUT /users/:userId/update/password', function () {
    describe('Update user password', function () {

      var currentUser;

      before(function (done) {
        User.create({ username: "foobar", email:"foobar@example.com", password:"foobar", role: userRoles.user} , function(err,user){
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

      it('should response update password success', function (done) {
       superagent.put('http://localhost:3000/users/'+currentUser._id+'/update/password/')
        .send({ actual: "foobar" , new: "foobar2"})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           done();
        });
      });

      it('should response invalid password', function (done) {
       superagent.put('http://localhost:3000/users/'+currentUser._id+'/update/password/')
        .send({ actual: "foobar3" , new: "foobar2"})
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message.should.equal("error.invalidPassword");
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