var userRoles = require('../../public/js/client/routingConfig').userRoles
/*
 * GET home page.
 */

exports.index = function(req, res){

	var role = userRoles.public, username = '';
  if(req.user) {
      role = req.user.role;
      username = req.user.username;
  }
  res.cookie('user', JSON.stringify({
      'username': username,
      'role': role
  }));

	res.render('index', {title:'Accueil'});
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.racePartials = function (req, res) {
  var name = req.params.name;
  res.render('partials/race/' + name);
};

exports.userPartials = function (req, res) {
  var name = req.params.name;
  res.render('partials/user/' + name);
};