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
        gmail: {
            user: "contact.nextrun@gmail.com",
            password: "Henrigolant!"
        }
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
        gmail: {
            user: "contact.nextrun@gmail.com",
            password: "Henrigolant!"
        }
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
        gmail: {
            user: "user",
            password: "pass"
        }
    },
    prod: {
        logLevel: "info",
        host: "192.95.25.173",
        db: "mongodb://192.95.25.173:27017/nextrun",
        root: rootPath,
        facebook: {
            clientID: "195803770591615",
            clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
            callbackURL: "http://nextrun.fr/auth/facebook/callback"
        },
        gmail: {
            user: "contact.nextrun@gmail.com",
            password: "Henrigolant!"
        }
    }
};