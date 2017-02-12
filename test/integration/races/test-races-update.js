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
 * Update Race tests


describe('Update Race: UPDATE /races', function() {


  var currentUser;
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

    it('should not update because unknown user', function(done) {
      superagent.put('http://localhost:3000/races/' + currentRace._id)
        .send({
          user: {
            email: "foobar3@example.com",
            username: "foobar3",
            role: userRoles.user
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidUser");
          done();
        });
    });

    it('should not update because user not allowed', function(done) {
      superagent.put('http://localhost:3000/races/' + currentRace._id)
        .send({
          user: {
            email: "foobar2@example.com",
            username: "foobar2",
            role: userRoles.user
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.invalidUser");
          done();
        });
    });

    it('should not update because race id is unknown', function(done) {
      superagent.put('http://localhost:3000/races/523726537a11c4aa8d789bbb')
        .send({
          user: {
            email: "foobar@example.com",
            username: "foobar",
            role: userRoles.user
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownId");
          done();
        });
    });

  });

  describe('Valid parameters', function() {

    it('should update success', function(done) {
      superagent.put('http://localhost:3000/races/' + currentRace._id)
        .send({
          race: {
            name: 'Triathlon de Castelnaudary',
            type: 'triathlon',
            department: '31 - Haute-Garonne',
            date: currentDate,
            edition: '2',
            distanceType: 'M'
          },
          user: {
            email: "foobar1@example.com",
            username: "foobar1",
            role: userRoles.user
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    it('should update the user to the database', function(done) {
      Race.findOne({
        _id: currentRace._id
      }).exec(function(err, race) {
        should.not.exist(err);
        race.should.be.an.instanceOf(Race);
        race.name.should.equal('Triathlon de Castelnaudary');
        race.type.should.equal('triathlon');
        race.department.should.equal('31 - Haute-Garonne');
        race.date.should.be.an.instanceOf(Date);
        //race.date.getTime().should.equal(new Date(currentDate).getTime());
        race.edition.should.equal(2);
        race.distanceType.should.equal('M');
        race.user_id.should.eql(currentUser._id);
        race.published.should.equal(false);
        currentRace = race;
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
 */