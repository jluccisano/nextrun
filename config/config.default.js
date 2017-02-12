var path = require('path')
, rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost/nextrun',
	root: rootPath,
    facebook: {
        clientID: "195803770591615",
        clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }
  },
  test: {
    db: 'mongodb://localhost/nextrun',
	root: rootPath,
    facebook: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }
  },
  production: {
  	db: 'mongodb://af_sportevents-joseph_luccisano:1t3nma3cnt6asnv09kpg5bb7o0@ds041758.mongolab.com:41758/af_sportevents-joseph_luccisano',
	root: rootPath,
    facebook: {
        clientID: "195803770591615",
        clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
        callbackURL: "http://sportevents.eu01.aws.af.cm/auth/facebook/callback"
    }
  }
};