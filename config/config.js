var path = require("path"),
    rootPath = path.normalize(__dirname + "/..");

module.exports = {
    development: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://localhost:27017/nextrun",
        root: rootPath,
        tmpFolder: "./.tmp/",
        domain: "localhost",
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        mailgun: {
            api_key: "key",
            domain: "sandbox.mailgun.org"
        }
    },
    dist: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://localhost/nextrun",
        root: rootPath,
        tmpFolder: "./.tmp/",
        domain: "localhost",
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        mailgun: {
            api_key: "key",
            domain: "sandbox.mailgun.org"
        }
    },
    test: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://localhost:27017/nextrun_test",
        root: rootPath,
        tmpFolder: "./.tmp/",
        domain: "localhost",
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        mailgun: {
            api_key: "key",
            domain: "xxxx.mailgun.org"
        }
    },
    prod: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://mongo:27017/nextrun",
        root: rootPath,
        tmpFolder: "/tmp/",
        domain: "nextrun.fr",
        facebook: {
            clientID: "clientId",
            clientSecret: "secret",
            callbackURL: "http://nextrun.fr/auth/facebook/callback"
        },
        mailgun: {
            api_key: "key",
            domain: "xxxx.mailgun.org"
        }
    }
};
