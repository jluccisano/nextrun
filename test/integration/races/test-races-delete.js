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
  ObjectId = mongoose.Schema.Types.ObjectId,
  passportStub = require('passport-stub'),
  User = mongoose.model('User');

passportStub.install(app);

/**
 * Delete race tests
 *
 * Non valide
 * Aucun  utilisateur connecté
 * l'utilisateur connecté n'est pas propriétaire de la manifestation
 * 
 * Valide 
 * Le user connecté est propriétaire de la manifestation
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

describe('Delete race: DELETE /races', function() {

  var currentRace;
  var currentDate = new Date();


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

  before(function(done) {

    passportStub.login(user1);

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
      done();
      passportStub.logout(user1);
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
      race.user_id.should.eql(user1._id);
      race.published.should.equal(false);
      currentRace = race;
      done();
    });
  });



  describe('invvalid parameters', function() {

    it('should not delete because access denied', function(done) {
      superagent.del('http://localhost:3000/races/' + currentRace._id + '/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(403);
          res.body.message[0].should.equal("error.accessDenied");
          done();
        });
    });



    it('should not delete because user not Owner', function(done) {

      passportStub.login(user2);

      superagent.del('http://localhost:3000/races/' + currentRace._id + '/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.userNotOwner");

          passportStub.logout(user2);
          done();
        });
    });



    it('should not delete because race id is unknown', function(done) {

      passportStub.login(user1);

      superagent.del('http://localhost:3000/races/523726537a11c4aa8d789bbb/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownId");
          passportStub.logout(user1);
          done();
        });
    });


  });

  describe('valid parameters', function() {

    it('should delete success', function(done) {

      passportStub.login(user1);

      superagent.del('http://localhost:3000/races/' + currentRace._id + '/delete')
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
        passportStub.logout(user1);
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