process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , superagent = require('superagent')
  , app = require('../server')
  , context = describe
  , Contact = mongoose.model('Contact');

var cookies, count;

/**
 * Contacts tests
 */

describe('Contacts', function () {
  describe('POST /contacts', function () {

	describe('Invalid parameters', function () {
      before(function (done) {
        Contact.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });

      
      it('no email - should respond with errors', function (done) {
       superagent.post('http://localhost:3000/contacts')
        .send({ type: 'athlete' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message[0].should.equal("error.emailCannotBeBlank");
           done();
        });
      });
      

      it('email blank - should respond with errors', function (done) {
       superagent.post('http://localhost:3000/contacts')
        .send({ email: '', type: 'athlete' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message[0].should.equal("error.emailCannotBeBlank");
           done();
        });
      });

      it('should not save the contact to the database', function (done) {
        Contact.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });

      after(function(done){
        Contact.remove({}, function(){
          done();
        });
      });
    });

	describe('Valid parameters', function () {
      before(function (done) {
        Contact.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });

      it('add new contact', function (done) {
       superagent.post('http://localhost:3000/contacts')
        .send({ email: 'foobar@example.com', type: 'athlete' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           done();
        });
      });

      it('should save the contact to the database', function (done) {
        Contact.count(function (err, cnt) {
          cnt.should.equal(count + 1);
          done();
        });
      });
    });

    describe('Contact already exists', function () {

      it('Contact already exists', function (done) {
       superagent.post('http://localhost:3000/contacts')
        .send({ email: 'foobar@example.com', type: 'athlete' })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(400);
           res.body.message[0].should.equal("error.emailAlreadyExists");
           done();
        });
      });
      

      it('should not have new contact to the database', function (done) {
        Contact.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });
    });

    after(function(done){
      Contact.remove({}, function(){
        done();
      });
    });

  });

});
