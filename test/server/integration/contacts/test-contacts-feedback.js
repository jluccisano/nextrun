process.env.NODE_ENV = 'test';
process.env.PORT= 4000;

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  superagent = require('superagent'),
  app = require('../../../../server'),
  context = describe

  /**
   * Create contact tests
   */

  describe('Create Contact: POST /api/contacts/feedback', function() {

    describe('Invalid parameters', function() {

      it('no email - should respond with errors', function(done) {
        superagent.post('http://localhost:'+process.env.PORT+'/api/contacts/feedback')
          .send()
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(400);
            res.body.message[0].should.equal("error.occured");
            done();
          });
      });
    });



    describe('Valid parameters', function() {

      it('add new feedback success', function(done) {
        superagent.post('http://localhost:'+process.env.PORT+'/api/contacts/feedback')
          .send({
            feedback: {
              email: 'foobar@example.com',
              type: {
                name: 'bug'
              },
              message: 'new bug',
              raceId: '523726537a11c4aa8d789bbb'
            }
          })
          .set('Accept', 'application/json')
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            done();
          });
      });

    });

  });
