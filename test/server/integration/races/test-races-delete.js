process.env.NODE_ENV = 'test';
process.env.PORT= 4000;

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  request = require('superagent'),
  app = require('../../../../server'),
  context = describe,
  userRoles = require('../../../../client/routingConfig').userRoles,
  Race = mongoose.model('Race'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  User = mongoose.model('User'),
  superagent = request.agent(app);


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

describe('Delete race: DELETE /api/races', function() {

  before(function(done) {
    User.remove({}, function() {
      done();
    });
  });

  before(function(done) {
    Race.remove({}, function() {
      done();
    });
  });

  var currentRace;
  var currentDate = new Date();


  before(function(done) {
    User.create(user1, function(err, user) {
      user1._id = user._id;
      done();
    });
  });

  before(function(done) {
    User.create(user2, function(err, user) {
      user2._id = user._id;
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

    Race.create({
      name: 'Duathlon de Castelnaudary',
      type: {
        name: 'duathlon',
        i18n: 'Duathlon'
      },
      pin: {
        location: {
          lat: 45.34,
          lon: 1.7
        },
        name: 'Castelnaudary',
        department: {
          code: '11',
          name: 'Aude',
          region: 'Languedoc-Roussillon'
        }
      },
      date: currentDate,
      edition: '1',
      distanceType: {
        name: 'S',
        i18n: ''
      },
      user_id: user1._id,
      last_update: new Date(),
      created_date: new Date()
    }, function(err, race) {
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
      race.type.name.should.equal('duathlon');
      race.pin.department.name.should.equal('Aude');
      race.date.should.be.an.instanceOf(Date);
      race.edition.should.equal(1);
      race.distanceType.name.should.equal('S');
      race.user_id.should.eql(user1._id);
      race.published.should.equal(false);
      currentRace = race;
      done();
    });
  });


  describe('Access denied', function() {
    it('should not delete because access denied', function(done) {
      superagent.del('http://localhost:'+process.env.PORT+'/api/races/' + currentRace._id + '/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(403);
          res.body.message[0].should.equal("error.accessDenied");
          done();
        });
    });

  });

  describe('invvalid parameters', function() {

    before(function(done) {
      superagent.post('http://localhost:'+process.env.PORT+'/api/users/session')
        .send({
          email: 'foobar2@example.com',
          password: '123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar2");
          res.body.role.title.should.equal("user");
          done();
        });
    });

    it('should not delete because user not Owner', function(done) {
      superagent.del('http://localhost:'+process.env.PORT+'/api/races/' + currentRace._id + '/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.userNotOwner");
          done();
        });
    });

    after(function(done) {
      superagent.post('http://localhost:'+process.env.PORT+'/api/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('invvalid parameters', function() {

    before(function(done) {
      superagent.post('http://localhost:'+process.env.PORT+'/api/users/session')
        .send({
          email: 'foobar1@example.com',
          password: '123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar1");
          res.body.role.title.should.equal("user");
          done();
        });
    });

    it('should not delete because race id is unknown', function(done) {
      superagent.del('http://localhost:'+process.env.PORT+'/api/races/523726537a11c4aa8d789bbb/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.unknownId");
          done();
        });
    });

    after(function(done) {
      superagent.post('http://localhost:'+process.env.PORT+'/api/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

  });

  describe('valid parameters', function() {

    before(function(done) {
      superagent.post('http://localhost:'+process.env.PORT+'/api/users/session')
        .send({
          email: 'foobar1@example.com',
          password: '123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.username.should.equal("foobar1");
          res.body.role.title.should.equal("user");
          done();
        });
    });

    it('should delete success', function(done) {
      superagent.del('http://localhost:'+process.env.PORT+'/api/races/' + currentRace._id + '/delete')
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

    after(function(done) {
      superagent.post('http://localhost:'+process.env.PORT+'/api/users/logout')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
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