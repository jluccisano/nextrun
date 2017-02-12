var userRoles = require("../../client/routingConfig").userRoles,
  phantom = require("node-phantom-simple"),
  logger = require("../../config/logger.js");
/*
 * GET home page.
 */

exports.index = function(req, res) {

  var role = userRoles.public,
    username = "",
    email = "",
    id = "";
  if (req.user) {
    id = req.user._id;
    role = req.user.role;
    username = req.user.username;
    email = req.user.email;
  }
  res.cookie("user", JSON.stringify({
    "id": id,
    "email": email,
    "username": username,
    "role": role
  }));

  res.render("index", {
    title: "Accueil"
  });

};

exports.partials = function(req, res) {
  var name = req.params.name;
  var type = req.params.type;

  var partial = "partials/" + name;

  if (type) {
    partial = "partials/" + type + "/" + name;
  }

  res.render(partial);
};