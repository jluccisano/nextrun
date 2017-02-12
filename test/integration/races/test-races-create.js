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
 * Create race tests
 *
 * Non valide
 * Aucun  utilisateur connecté
 *
 * Valide
 * Le user est connecté
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

describe('Create race: POST /api/races', function() {

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


  describe('Valid parameters', function() {

    it('should response success', function(done) {
      passportStub.login(user1);
      superagent.post('http://localhost:3000/api/races/create')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'S'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          passportStub.logout(user1);
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
        race.user_id.should.eql(user1._id);
        race.published.should.equal(false);
        done();
      });
    });

    it('create new race with distance type different should response success', function(done) {
      passportStub.login(user1);
      superagent.post('http://localhost:3000/api/races/create')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'M'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          passportStub.logout(user1);
          done();
        });
    });

  });

  describe('Invalid parameters', function() {

    it('should not create because access denied', function(done) {
      superagent.post('http://localhost:3000/api/races/create')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'S'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(403);
          res.body.message[0].should.equal("error.accessDenied");
          done();
        });
    });

    it('should response raceAlreadyExists', function(done) {
      passportStub.login(user1);
      superagent.post('http://localhost:3000/api/races/create')
        .send({
          race: {
            name: 'Duathlon de Castelnaudary',
            type: 'duathlon',
            department: '11 - Aude',
            date: currentDate,
            edition: '1',
            distanceType: 'S'
          }
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.raceAlreadyExists");
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