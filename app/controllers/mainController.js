/*
 * GET home page.
 */

exports.index = function(req, res){
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