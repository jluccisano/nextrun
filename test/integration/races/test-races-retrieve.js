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
  User = mongoose.model('User');


/**
 * Retrieve Races tests
 */

describe('Retrieve races: GET /users/:userId/races/(page/:page)?', function() {

  var currentUser;
  var currentUser2;
  var currentRace;
  var currentDate = new Date();

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

  it('should save the user 2 to the database', function(done) {
    User.findOne({
      email: 'foobar2@example.com'
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal('foobar2@example.com');
      currentUser2 = user;
      done();
    });
  });

  before(function(done) {
    Race.create({
      name: 'Duathlon de Castelnaudary',
      type: 'duathlon',
      department: '11 - Aude',
      date: currentDate,
      edition: '1',
      distanceType: 'S',
      user_id: currentUser._id,
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

  describe('invalid parameters', function() {

    it('test with bad user parameter should return invalid user', function(done) {
      superagent.get('http://localhost:3000/users/' + currentUser2._id + '/races/page/1')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.races.length.should.equal(0);
          done();
        });
    });
  });

  describe('valid parameters', function() {

    it('should return one race', function(done) {
      superagent.get('http://localhost:3000/users/' + currentUser._id + '/races')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.races[0].name.should.equal("Duathlon de Castelnaudary");
          done();
        });
    });

    it('test with page parameter should return one race', function(done) {
      superagent.get('http://localhost:3000/users/' + currentUser._id + '/races/page/1')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.races[0].name.should.equal("Duathlon de Castelnaudary");
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