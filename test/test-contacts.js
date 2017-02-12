process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
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
        request(app)
        .post('/contacts')
        .field('type', 'athlete')
        .end(done);
      })

      it('email blank - should respond with errors', function (done) {
        request(app)
        .post('/contacts')
        .field('email', '')
        .field('type', 'athlete')
        .end(done);
      })

      it('should not save the contact to the database', function (done) {
        Contact.count(function (err, cnt) {
          count = cnt;
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
        request(app)
        .post('/contacts')
        .field('email', 'foobar@example.com')
        .field('type', 'athlete')
        .end(done);
      })

      it('should save the contact to the database', function (done) {
        Contact.count(function (err, cnt) {
          cnt.should.equal(count + 1);
          done();
        });
      });
    });

    describe('Contact already exists', function () {

      it('Contact already exists', function (done) {
        request(app)
        .post('/contacts')
        .field('email', 'foobar@example.com')
        .field('type', 'athlete')
        .end(done);
      })
      

      it('should not have new contact to the database', function (done) {
        Contact.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });
    });

  });

  after(function (done) {
    require('./helper').clearDb(done)
  });
});