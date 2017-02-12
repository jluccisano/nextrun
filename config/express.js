/**
 * Module dependencies.
 */

var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var logger = require("morgan");
var multer = require("multer");
var errorHandler = require("errorhandler");
var session = require("express-session");
var MongoStore = require("connect-mongo")({
    session: session
});
var cookieParser = require("cookie-parser");
var compression = require("compression");
var csrf = require("csurf");
var winston = require("winston");
var expressWinston = require("express-winston");
var helpers = require("view-helpers");
var pkg = require("../package.json");
var env = process.env.NODE_ENV || "development";

module.exports = function(app, express, passport) {

    app.set("env", env);

    app.use(favicon(app.config.root + "/client/favicon.ico"));

    app.use(logger("dev"));

    //set views path, template engine and default layout
    app.set("views", app.config.root + "/server/views");
    app.set("view engine", "jade");


    app.use(methodOverride());

    //http://stackoverflow.com/questions/19917401/node-js-express-request-entity-too-large
    //fix bug limit request entity too large
    app.use(bodyParser.json({
        limit: "50mb"
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: "50mb"
    }));

    app.use(multer());

    // cookieParser should be above session
    app.use(cookieParser("jhfhsdbfhjezbfksbdfknnzehjfbhjbjb"));

    app.use(session({
        secret: pkg.name,
        saveUninitialized: true,
        resave: true,
        store: new MongoStore({
            url: app.config.db,
            collection: "sessions",
            auto_reconnect: true
        })
    }));

    if (app.get("env") !== "test") {

        var csrfValue = function(req) {
            var token = (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers["x-csrf-token"]) || (req.headers["x-xsrf-token"]);
            return token;
        };

        app.use(csrf({
            value: csrfValue
        }));


        // This could be moved to view-helpers :-)
        app.use(function(req, res, next) {
            res.locals.csrf_token = req.csrfToken();
            res.cookie("XSRF-TOKEN", req.csrfToken());
            next();
        });
    }

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session({
        maxAge: new Date(Date.now() + 3600000)
    }));

    // should be placed before express.static
    app.use(compression({
        threshold: 512,
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader("Content-Type"));
        }
    }));

    // should be declared after session
    app.use(helpers(pkg.name));

    // Express middlewares
    app.use(express.static(app.config.root + "/client"));

    if (app.get("env") === "development") {
        app.use("/client/bower_components", express.static(app.config.root + "/client/bower_components"));
        app.use("/client/modules", express.static(app.config.root + "/client/modules"));
        app.use("/styles", express.static(app.config.root + "/.tmp/styles"));
    } else {
        app.use("/client/scripts", express.static(app.config.root + "/client/scripts"));
        app.use("/client/modules", express.static(app.config.root + "/client/modules"));
        app.use("/client/styles", express.static(app.config.root + "/client/styles"));
    }

    // development only
    if ("development" === app.get("env")) {
        app.use(errorHandler());
    }

    if (app.get("env") === "prod") {
        app.use(require("prerender-node").set("prerenderToken", "dzNULbJdLvZWcUyB8Su5"));
    }


    // winston config
    app.use(expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            })
        ]
    }));

    // expose package.json to views
    app.use(function(req, res, next) {
        res.locals.pkg = pkg;
        next();
    });

    app.set("showStackError", true);
};