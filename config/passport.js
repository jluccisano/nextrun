var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  User = mongoose.model('User'),
  logger = require('./logger');


module.exports = function(passport, config) {

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, function(err, user) {
      done(err, user);
    });
  });

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: ['error.invalidEmailOrPassword']
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: ['error.invalidEmailOrPassword']
          });
        }
        return done(null, user);
      });
    }
  ));

  // use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            firstname: profile.first_name,
            lastname: profile.last_name,
            email: profile.emails[0].value,
            provider: 'facebook',
            facebook: profile._json
          });
          user.save(function(err) {
            if (err) {
              logger.error(err);
              return done(err, user);
            }
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};