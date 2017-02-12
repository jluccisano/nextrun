var userRoles = require('../../public/js/routingConfig').userRoles,
  phantom = require('node-phantom');
/*
 * GET home page.
 */

exports.index = function(req, res) {

  console.log("index");

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

  var ua;
  ua = req.headers['user-agent'];
  console.log(ua);
  if (ua.match(/bot/i)) {

    generateSnapShot(req, res);

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

  console.log(partial);

  if (type) {
    partial = 'partials/' + type + '/' + name;
  }



  res.render(partial);



};

var generateSnapShot = function(req, res) {

  console.log("generateSnapShot");

  phantom.create(function(err, ph) {
    console.log("create new instance");
    ph.createPage(function(err, page) {

      console.log("create new page");

      console.log("error1: " + err);
      console.log(page);

      page.open("http://localhost:3000" + req.path, function(err, status) {

        page.onConsoleMessage = function(msg) {
          console.log(msg);
        };


        if (status === 'success') {

          var delay, checkerCounter = 0,
            checker = (function() {

              checkerCounter++;

              page.evaluate(function() {

                console.log("loading");
                var body = document.getElementsByTagName('body')[0];
                console.log(body);
                if (body.getAttribute('data-status') === 'ready') {
                  console.log("isready");
                  return document.getElementsByTagName('html')[0].innerHTML;
                }


              }, function(err, html) {

                if (html || checkerCounter >= 50) {
                  if (html) {
                    //console.log(res.locals);
                    //res.setHeader("Content-Type", "text/html");
                    //res.write("<p>Hello World</p>");
                    //res.end();

                    res.send(html);


                  } else {
                    res.send(404, "cannot generate snapshot");
                  }

                  clearTimeout(delay);
                  ph.exit();



                  //next();
                }
              });


            });
          delay = setInterval(checker, 100);
        } else {
          ph.exit();
          res.send(404, "cannot generate snapshot");
          //next();
        }
      });
    });
  });
};