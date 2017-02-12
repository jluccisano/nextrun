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
 * Create race tests
 */

describe('Create race: POST /races', function() {

  var currentDate = new Date();
  var currentUser;

  before(function(done) {
    User.create({
      username: "foobar",
      email: "foobar@example.com",
      password: "foobar",
      role: userRoles.user
    }, function(err, user) {
      currentUser = user;
      done();
    });
  });

  it('should save the user to the database', function(done) {
    User.findOne({
      email: 'foobar@example.com'
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal('foobar@example.com');
      done();
    });
  });

  describe('Valid parameters', function() {

    it('should response success', function(done) {
      superagent.post('http://localhost:3000/users/session')
        .send({
          email: 'foobar@example.com',
          password: 'foobar'
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

    it('should response success', function(done) {
      superagent.post('http://localhost:3000/races')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'S'
          },
          user: {
            email: "foobar@example.com",
            username: "foobar",
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
        done();
      });
    });

    it('create new race with distance type different should response success', function(done) {
      superagent.post('http://localhost:3000/races')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'M'
          },
          user: {
            email: "foobar@example.com",
            username: "foobar",
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

  });
  describe('Invalid parameters', function() {

    it('should response raceAlreadyExists', function(done) {
      superagent.post('http://localhost:3000/races')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'S'
          },
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
          res.body.message[0].should.equal("error.raceAlreadyExists");
          done();
        });
    });

    it('create new race with unknown user should response error', function(done) {
      superagent.post('http://localhost:3000/races')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'M'
          },
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
          res.body.message[0].should.equal("error.unknownUser");
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