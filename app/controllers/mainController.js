var userRoles = require('../../public/js/routingConfig').userRoles,
  phantom = require('node-phantom-simple');
/*
 * GET home page.
 */

exports.index = function(req, res) {

  var role = userRoles.public,
    username = '',
    email = '',
    id = '';
  if (req.user) {
    id = req.user._id;
    role = req.user.role;
    username = req.user.username;
    email = req.user.email;
  }
  res.cookie('user', JSON.stringify({
    'id': id,
    'email': email,
    'username': username,
    'role': role
  }));

  var ua = req.headers['user-agent'];
  if ((typeof(ua) !== "undefined" && ua.match(/bot/i)) || typeof(req.query._escaped_fragment_) !== "undefined" || typeof(req.query.fb_locale) !== "undefined") {

    generateSnapshot(req, res);

  } else {
    res.render('index', {
      title: 'Accueil'
    });
  }


};

exports.partials = function(req, res) {
  var name = req.params.name;
  var type = req.params.type;

  var partial = 'partials/' + name;

  if (type) {
    partial = 'partials/' + type + '/' + name;
  }

  res.render(partial);
};

var generateSnapshot = function(req, res) {

  console.log("new crawler request");

  phantom.create(function(err, ph) {

    if (err) {
      console.log("error during create new phantom instance: " + err);
    }

    ph.createPage(function(err, page) {

      if (err) {
        console.log("error during create new phantom page: " + err);
      }

      page.open("http://127.0.0.1:3000" + req.path, function(err, status) {

        page.onConsoleMessage = function(msg) {
          console.log(msg);
        };


        if (status === 'success') {

          var delay, checkerCounter = 0,
            checker = (function() {

              checkerCounter++;

              page.evaluate(function() {
                var body = document.getElementsByTagName('body')[0];
                if (body.getAttribute('data-status') === 'ready') {
                  return document.documentElement.outerHTML;
                }
              }, function(err, html) {

                if (html || checkerCounter >= 50) {
                  if (html) {
                    res.send(html);
                  } else {
                    res.send(404, "cannot generate snapshot");
                  }

                  clearTimeout(delay);
                  ph.exit();
                }
              });

              if (checkerCounter >= 50) {
                clearTimeout(delay);
                ph.exit();
                res.send(404, "cannot generate snapshot");
              }


            });
          delay = setInterval(checker, 100);
        } else {
          ph.exit();
          res.send(404, "cannot generate snapshot");
        }
      });
    });
  }, {
    phantomPath: require('phantomjs').path
  });
};