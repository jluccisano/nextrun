process.env.NODE_ENV = "test";
process.env.PORT= 4000;

/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
  should = require("should"),
  app = require("../../../../server"),
  superagent = require("superagent"),
  userRoles = require("../../../../client/routingConfig").userRoles,
  User = mongoose.model("User");

/**
 * Check User tests
 */

describe("Check user: POST /api/users/check/email", function() {

  before(function(done) {
    User.remove({}, function() {
      done();
    });
  });

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

  it("check if user has been saved to the database", function(done) {
    User.findOne({
      email: "foobar@example.com"
    }).exec(function(err, user) {
      should.not.exist(err);
      user.should.be.an.instanceOf(User);
      user.email.should.equal("foobar@example.com");
      done();
    });
  });

  describe("Email Already Exists", function() {



    it("should response email Already Exists", function(done) {
      superagent.post("http://localhost:"+process.env.PORT+"/api/users/check/email")
        .send({
          user: {
            email: "foobar@example.com"
          }
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailAlreadyExists");
          done();
        });
    });


  });



  describe("Email Valid", function() {

    it("should response success", function(done) {
      superagent.post("http://localhost:"+process.env.PORT+"/api/users/check/email")
        .send({
          user: {
            email: "hello@example.com"
          }
        })
        .set("Accept", "application/json")
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

});
