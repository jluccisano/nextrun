process.env.NODE_ENV = 'test';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  should = require('should'),
  app = require('../../../../server'),
  context = describe,
  request = require('superagent'),
  userRoles = require('../../../../public/js/routingConfig').userRoles,
  User = mongoose.model('User'),
  Race = mongoose.model('Race'),
  superagent = request.agent(app);

/**
 * Delete user tests
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

describe('Delete User: DELETE /api/users', function() {

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
    Race.create({
      name: 'Duathlon de Castelnaudary',
      type: {
        name: 'duathlon',
        i18n: 'Duathlon'
      },
      department: {
        code: '11',
        name: 'Aude',
        region: 'Languedoc-Roussillon'
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
      race.department.name.should.equal('Aude');
      race.date.should.be.an.instanceOf(Date);
      //race.date.getTime().should.equal(new Date(currentDate).getTime());
      race.edition.should.equal(1);
      race.distanceType.name.should.equal('S');
      race.user_id.should.eql(user1._id);
      race.published.should.equal(false);
      currentRace = race;
      done();
    });
  });

  describe('Delete user failed', function() {

    it('should response access denied', function(done) {
      superagent.del('http://localhost:3000/api/users/delete')
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

  describe('Delete user success', function() {


    before(function(done) {
      superagent.post('http://localhost:3000/api/users/session')
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

    it('should response delete account success', function(done) {
      superagent.del('http://localhost:3000/api/users/delete')
        .send()
        .set('Accept', 'application/json')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    it('check if user not exits', function(done) {
      User.findOne({
        email: 'foobar1@example.com'
      }).exec(function(err, user) {
        should.not.exist(err);
        (user == null).should.be.true;
        done();
      });
    });

    it('check if no race exists for this user_id', function(done) {
      Race.findOne({
        user_id: user1._id
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