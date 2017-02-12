var path = require("path"),
    rootPath = path.normalize(__dirname + "/..");

module.exports = {
    development: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://localhost/nextrun",
        root: rootPath,
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        mailgun: {
            user: "devmaster@nextrunjosephluccisano.mailgun.org",
            password: "devmaster"
        },
        racesidx: "racesidx_v1"
    },
    dist: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://localhost/nextrun",
        root: rootPath,
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        mailgun: {
            user: "devmaster@nextrunjosephluccisano.mailgun.org",
            password: "devmaster"
        },
        racesidx: "racesidx_v1"
    },
    test: {
        logLevel: "info",
        host: "localhost",
        db: "mongodb://localhost:27017/nextrun_test",
        root: rootPath,
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        mailgun: {
            user: "user",
            password: "pass"
        },
        racesidx: "racesidx_test_v1"
    },
    prod: {
        logLevel: "error",
        host: "192.95.25.173",
        db: "mongodb://192.95.25.173:27017/nextrun",
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