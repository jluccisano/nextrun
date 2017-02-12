var path = require('path')
, rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost/nextrun',
    root: rootPath,
    facebook: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    mailgun: {
      user:"user",
      password:"pass"
    }
  },
  test: {
    db: 'mongodb://localhost/nextrun_test',
    root: rootPath,
    facebook: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    mailgun: {
      user:"user",
      password:"pass"
    }
  },
  production: {
    db: 'mongodb://af_nextrun-joseph_luccisano:a6mfnkoa0bt8i7qhdl79qdi7lj@ds057548.mongolab.com:57548/af_nextrun-joseph_luccisano',
    root: rootPath,
    facebook: {
        clientID: "195803770591615",
        clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
        callbackURL: "http://nextrun.fr/auth/facebook/callback"
    },
    mailgun: {
      user:"webmaster@sportevents.mailgun.org",
      password:"0r5qtpq09vz7"
    }
  }
};