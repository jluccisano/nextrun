process.env.NODE_ENV = "test";
process.env.PORT= 4000;

/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
  should = require("should"),
  superagent = require("superagent"),
  app = require("../../../../server"),
  Contact = mongoose.model("Contact");


/**
 * Create contact tests
 */

describe("Create Contact: POST /api/contacts", function() {

  before(function(done) {
    Contact.remove({}, function() {
      done();
    });
  });

  var count;

  before(function(done) {
    Contact.count(function(err, cnt) {
      count = cnt;
      done();
    });
  });

  describe("Invalid parameters", function() {

    it("no email - should respond with errors", function(done) {
      superagent.post("http://localhost:"+process.env.PORT+"/api/contacts")
        .send({
          type: "athlete"
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailCannotBeBlank");
          done();
        });
    });

    it("email blank - should respond with errors", function(done) {
      superagent.post("http://localhost:"+process.env.PORT+"/api/contacts")
        .send({
          email: "",
          type: "athlete"
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailCannotBeBlank");
          done();
        });
    });

    it("check if contact has not been saved to the database", function(done) {
      Contact.count(function(err, cnt) {
        count = cnt;
        done();
      });
    });

  });

  describe("Valid parameters", function() {

    it("add new contact success", function(done) {
      superagent.post("http://localhost:"+process.env.PORT+"/api/contacts")
        .send({
          email: "foobar@example.com",
          type: "athlete"
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });

    it("check if contact has been saved to the database", function(done) {
      Contact.count(function(err, cnt) {
        cnt.should.equal(count + 1);
        done();
      });
    });
  });

  describe("Contact already exists", function() {

    it("Contact already exists", function(done) {
      superagent.post("http://localhost:"+process.env.PORT+"/api/contacts")
        .send({
          email: "foobar@example.com",
          type: "athlete"
        })
        .set("Accept", "application/json")
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(400);
          res.body.message[0].should.equal("error.emailAlreadyExists");
          done();
        });
    });

    it("check if contact has not been saved to the database", function(done) {
      Contact.count(function(err, cnt) {
        count = cnt;
        done();
      });
    });
  });

  after(function(done) {
    Contact.remove({}, function() {
      done();
    });
  });
});