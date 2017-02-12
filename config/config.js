var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    host: 'Helios',
    db: 'mongodb://Helios/nextrun',
    root: rootPath,
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    mailgun: {
      user: "devmaster@nextrunjosephluccisano.mailgun.org",
      password: "devmaster"
    },
    racesidx: "racesidx_v1"
  },
  test: {
    host: 'Helios',
    db: 'mongodb://Helios/nextrun_test',
    root: rootPath,
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: 'http://Helios:3000/auth/facebook/callback'
    },
    mailgun: {
      user: "user",
      password: "pass"
    },
    racesidx: "racesidx_test_v1"
  },
  prod: {
    host: 'localhost',
    db: 'mongodb://localhost:nextrun_adm:malili011004/nextrun',
    root: rootPath,
    facebook: {
      clientID: "195803770591615",
      clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
      callbackURL: "http://nextrun.fr/auth/facebook/callback"
    },
    mailgun: {
      user: "postmaster@nextrunjosephluccisano.mailgun.org",
      password: "1jo8rmgvkpe6"
    },
    racesidx: "racesidx_v1"
  }
};