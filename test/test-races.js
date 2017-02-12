process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , superagent = require('superagent')
  , app = require('../server')
  , context = describe
  , userRoles = require('../public/js/client/routingConfig').userRoles
  , Race = mongoose.model('Race')
  , User = mongoose.model('User');

var count;

/**
 * Races tests
 */

 describe('Races', function () {
  describe('POST /races', function () {

	describe('Invalid parameters', function () {
      before(function (done) {
        Race.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });

      after(function(done){
        Race.remove({}, function(){
          done();
        });
      });
    });

	describe('Valid parameters', function () {

	  var currentDate = new Date();
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

      it('should response success', function (done) {
       superagent.post('http://localhost:3000/races')
        .send({race: { name:'Duatlon de Castelnaudary', 
        			   type: 'duathlon',
        			   department: '11 - Aude',
        			   date: currentDate, 
        			   edition: '1',
        			   distanceType: 'S'
        			 }
        })
        .set('Accept', 'application/json')
        .end(function(err,res){
           should.not.exist(err);
           res.should.have.status(200);
           done();
        });
      });

      it('should save the user to the database', function (done) {
        Race.findOne({ name: 'Duatlon de Castelnaudary' }).exec(function (err, race) {
          should.not.exist(err);
          race.should.be.an.instanceOf(Race);
          race.name.should.equal('Duatlon de Castelnaudary');
          race.type.should.equal('duathlon');
          race.department.should.equal('11 - Aude');
          race.date.should.equal(currentDate);
          race.edition.should.equal('1');
          race.distanceType.should.equal('S');
          race.status.should.equal('building');
          //race.user_id.should.equal(currentUser._id);
          race.published.should.equal(false);
          done();
        });
      });


    after(function(done){
      Race.remove({}, function(){
        done();
      });
    });

  });
});
});