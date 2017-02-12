process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  superagent = require('superagent'),
  app = require('../../../server'),
  context = describe,
  userRoles = require('../../../public/js/client/routingConfig').userRoles,
  Race = mongoose.model('Race'),
  passportStub = require('passport-stub'),
  User = mongoose.model('User');

passportStub.install(app);

/**
 * Delete race tests
 */

 var user1 = {
    username:'foobar1',
    email: "foobar1@example.com",
    role: { bitMask: 2, title: 'user' },
    _id: '1',
    password:'123'
};

var user2 = {
    username:'foobar2',
    email: "foobar2@example.com",
    role: { bitMask: 2, title: 'user' },
    _id: '2',
    password:'123'
};

describe('Delete race: DELETE /races', function() {


  var currentUser;
  var currentRace;
  var currentDate = new Date();

/*
  before(function(done) {
   var userArray = [{
      username: "foobar1",
      email: "foobar1@example.com",
      password: "foobar1",
      role: userRoles.user
    }, {
      username: "foobar2",
      email: "foobar2@example.com",
      password: "foobar2",
      role: userRoles.user
    }];
    User.create(userArray, function(err, user) {
      currentUser = user;
      done();
    });
  });*/

 /* it('should save the user 1 to the database', function(done) {
    User.findOne({
      email: 'foobar1@example.com'
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal('foobar1@example.com');
      done();
    });
  });

  it('should save the user 2 to the database', function(done) {
    User.findOne({
      email: 'foobar2@example.com'
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal('foobar2@example.com');
      done();
    });
  });*/

  before(function(done) {
    Race.create({
      name: 'Duathlon de Castelnaudary',
      type: 'duathlon',
      department: '11 - Aude',
      date: currentDate,
      edition: '1',
      distanceType: 'S',
      user_id: user1._id,
      last_update: new Date(),
      created_date: new Date()
    }, function(err, race) {
      console.log(err);
      done();
    });
  });

  it('should save the race to the database', function(done) {
    Race.findOne({
      name: 'Duathlon de Castelnaudary'
    }).exec(function(err, race) {
      should.not.exist(err);
      race.should.be.an.instanceOf(Race);
      race.name.should.equal('Duathlon de Castelnaudary');
      race.type.should.equal('duathlon');
      race.department.should.equal('11 - Aude');
      race.date.should.be.an.instanceOf(Date);
      //race.date.getTime().should.equal(new Date(currentDate).getTime());
      race.edition.should.equal(1);
      race.distanceType.should.equal('S');
      race.user_id.should.eql(currentUser._id);
      race.published.should.equal(false);
      currentRace = race;
      done();
    });
  });
/*
  describe('invvalid parameters', function() {

    it('should not delete because unknown user', function(done) {
      superagent.del('http://localhost:3000/races/' + currentRace._id)
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownUser");
          done();
        });
    });

    it('should not delete because user not allowed', function(done) {
      superagent.del('http://localhost:3000/races/' + currentRace._id)
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.userNotOwner");
          done();
        });
    });

    it('should not delete because race id is unknown', function(done) {
      superagent.del('http://localhost:3000/races/523726537a11c4aa8d789bbb')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownId");
          done();
        });
    });

  });
*/
  describe('valid parameters', function() {



    it('should response success', function(done) {
      passportStub.login(user1);
     /* superagent.post('http://localhost:3000/users/session')
        .send({
          email: 'foobar1@example.com',
          password: 'foobar1'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar");
          res.body.role.title.should.equal("user");
          done();
        });*/
    });

    it('should delete success', function(done) {
      
      superagent.del('http://localhost:3000/races/' + currentRace._id)
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    it('should not retrieve race to the database', function(done) {
      Race.findOne({
        _id: currentRace._id
      }).exec(function(err, race) {
        should.not.exist(err);
        (race == null).should.be.true;
        done();
      });
    });

  });

  after(function(done) {
    User.remove({}, function() {
      done();
    });
  });
  after(function(done) {
    Race.remove({}, function() {
      done();
    });
  });

});