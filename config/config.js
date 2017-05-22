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
            api_key: "key-9324f80c8afdf167552474844b7928b9",
            domain: "sandboxe6d48d6ead0043d498f98491b04f22e6.mailgun.org"
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
            api_key: "key-9324f80c8afdf167552474844b7928b9",
            domain: "sandboxe6d48d6ead0043d498f98491b04f22e6.mailgun.org"
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
            api_key: "key-9324f80c8afdf167552474844b7928b9",
            domain: "sandboxe6d48d6ead0043d498f98491b04f22e6.mailgun.org"
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
            clientID: "195803770591615",
            clientSecret: "409c4b0d091efef8e7d03db2bce807e9",
            callbackURL: "http://nextrun.fr/auth/facebook/callback"
        },
        mailgun: {
            api_key: "key-9324f80c8afdf167552474844b7928b9",
            domain: "sandboxe6d48d6ead0043d498f98491b04f22e6.mailgun.org"
        }
    }
};
