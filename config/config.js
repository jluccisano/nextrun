var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');

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
      user: "devmaster@nextrunjosephluccisano.mailgun.org",
      password: "devmaster"
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
      user: "user",
      password: "pass"
    }
  },
  production: {
    db: 'mongodb://af_nextrun-joseph_luccisano:c1dhahkj7oo021g9tfaslq3cr1@ds057568.mongolab.com:57568/af_nextrun-joseph_luccisano',
    root: rootPath,
    facebook: {
      clientID: "195803770591615",
      clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
      callbackURL: "http://nextrun.fr/auth/facebook/callback"
    },
    mailgun: {
      user: "postmaster@nextrunjosephluccisano.mailgun.org",
      password: "1jo8rmgvkpe6"
    }
  },
  valid: {
    db: 'mongodb://af_nextrun-valid-joseph_luccisano:n7udg9kmgpt0lrnt6hv2ahke0i@ds029979.mongolab.com:29979/af_nextrun-valid-joseph_luccisano',
    root: rootPath,
    facebook: {
      clientID: "195803770591615",
      clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
      callbackURL: "http://nextrun.fr/auth/facebook/callback"
    },
    mailgun: {
      user: "postmaster@nextrunjosephluccisano.mailgun.org",
      password: "1jo8rmgvkpe6"
    }
  }
};