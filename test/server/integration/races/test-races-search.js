process.env.NODE_ENV = "test";
process.env.PORT= 4000;

/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
  should = require("should"),
  request = require("superagent"),
  app = require("../../../../server"),
  Race = mongoose.model("Race"),
  User = mongoose.model("User"),
  moment = require("moment"),
  superagent = request.agent(app);


var user1 = {
  username: "foobar1",
  email: "foobar1@example.com",
  role: {
    bitMask: 2,
    title: "user"
  },
  _id: "123726537a11c4aa8d789bbc",
  password: "123"
};


describe("Search races: POST /api/races/search", function() {

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

  it("should save the user 1 to the database", function(done) {
    User.findOne({
      email: "foobar1@example.com"
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal("foobar1@example.com");
      done();
    });
  });

  before(function(done) {

    Race.create({
      name: "Duathlon de Castelnaudary",
      type: {
        name: "duathlon",
        i18n: "Duathlon"
      },
      pin: {
        location: {
          lat: 43.317551,
          lon: 1.954540
        },
        name: "Castelnaudary",
        department: {
          code: "11",
          name: "Aude",
          region: "Languedoc-Roussillon"
        }
      },
      date: currentDate,
      edition: "1",
      distanceType: {
        name: "S",
        i18n: ""
      },
      user_id: user1._id,
      last_update: new Date(),
      created_date: new Date(),
      published: true
    }, function(err, race) {
      done();
    });
  });

  it("should save the race to the database", function(done) {
    Race.findOne({
      name: "Duathlon de Castelnaudary"
    }).exec(function(err, race) {
      should.not.exist(err);
      race.should.be.an.instanceOf(Race);
      race.name.should.equal("Duathlon de Castelnaudary");
      race.type.name.should.equal("duathlon");
      race.pin.department.name.should.equal("Aude");
      race.date.should.be.an.instanceOf(Date);
      race.edition.should.equal(1);
      race.distanceType.name.should.equal("S");
      race.user_id.should.eql(user1._id);
      race.published.should.equal(true);
      currentRace = race;
      done();
    });
  });

  describe("invalid parameters", function() {

    it("should return error when no criteria is sent", function(done) {

      superagent.post("http://localhost:"+process.env.PORT+"/api/races/search")
        .send()
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.noCriteria");
          done();
        });
    });

  });

  describe("valid parameters", function() {

    beforeEach(function(done) {
      setTimeout(function() {
        //waiting for elasticsearch update index
        done();
      }, 2500);
    });

    it("should return one race", function(done) {

      superagent.post("http://localhost:"+process.env.PORT+"/api/races/search")
        .send({
          criteria: {
            fulltext: "dua",
            types: [],
            departments: [],
            dateRange: {}
          }
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.hits.hits.length.should.equal(1);
          res.body.hits.hits[0].fields.partial1[0].name.should.equal("Duathlon de Castelnaudary");
          done();
        });
    });

    it("should return one race", function(done) {

      superagent.post("http://localhost:"+process.env.PORT+"/api/races/search")
        .send({
          criteria: {
            fulltext: "dua",
            types: ["duathlon"],
            from: 0,
            size: 100,
            sort: "_score",
            departments: ["11"],
            dateRange: {
              startDate: moment().subtract("days", 29),
              endDate: moment().add("days", 29)
            }
          }
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.hits.hits.length.should.equal(1);
          res.body.hits.hits[0].fields.partial1[0].name.should.equal("Duathlon de Castelnaudary");
          done();
        });
    });

    it("search with geolocation - should return one race", function(done) {

      superagent.post("http://localhost:"+process.env.PORT+"/api/races/search")
        .send({
          criteria: {
            distance: 100,
            searchAround: true,
            location: {
              lat: 43.635340,
              lon: 1.458438
            }
          }
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.hits.hits.length.should.equal(1);
          res.body.hits.hits[0].fields.partial1[0].name.should.equal("Duathlon de Castelnaudary");
          done();
        });
    });

    it("search with region - should return one race", function(done) {

      superagent.post("http://localhost:"+process.env.PORT+"/api/races/search")
        .send({
          criteria: {
            fulltext: "dua",
            types: ["duathlon"],
            region: {
              name: "Languedoc-Roussillon",
              departments: ["11", "30", "34", "48", "66"]
            },
            dateRange: {
              startDate: moment().subtract("days", 29),
              endDate: moment().add("days", 29)
            }
          }
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.hits.hits.length.should.equal(1);
          res.body.hits.hits[0].fields.partial1[0].name.should.equal("Duathlon de Castelnaudary");
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