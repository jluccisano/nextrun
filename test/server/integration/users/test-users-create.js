process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  app = require('../../../../server'),
  context = describe,
  superagent = require('superagent'),
  userRoles = require('../../../../public/js/routingConfig').userRoles,
  User = mongoose.model('User');



/**
 * Create user tests
 */
describe('Create User: POST /api/users', function() {



  describe('Invalid parameters', function() {

    var count;

    before(function(done) {
      User.count(function(err, cnt) {
        count = cnt;
        done();
      })
    })


    it('no email - should respond with errors', function(done) {
      superagent.post('http://localhost:3000/api/users/signup')
        .send({
          user: {
            username: 'foobar',
            email: '',
            password: 'foobar'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailCannotBeBlank");
          done();
        });
    });

    it('no body - should respond with errors', function(done) {
      superagent.post('http://localhost:3000/api/users/signup')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailCannotBeBlank");
          done();
        });
    });

    it('check if no user has been saved to the database', function(done) {
      User.count(function(err, cnt) {
        count.should.equal(cnt)
        done()
      })
    })

    after(function(done) {
      User.remove({}, function() {
        done();
      });
    });
  })

  describe('Valid parameters', function() {


    it('should response success', function(done) {
      superagent.post('http://localhost:3000/api/users/signup')
        .send({
          user: {
            username: 'foobar',
            email: 'foobar@example.com',
            password: 'foobar'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar");
          res.body.role.title.should.equal("user");
          done();
        });
    });


    it('check if a user has been saved to the database', function(done) {
      User.findOne({
        email: 'foobar@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        user.email.should.equal('foobar@example.com');
        done();
      });
    });

    after(function(done) {
      User.remove({}, function() {
        done();
      });
    });

  });



});