/*!
 * NEXTRUN
 * Copyright(c) 2013 Joseph Luccisano
 */
var env = process.env.NODE_ENV || "development";
console.log("run on environment:" + env);

/**
 * Module dependencies.
 */
var express = require("express"),
    fs = require("fs"),
    passport = require("passport"),
    config = require("./config/config")[env],
    mongoose = require("mongoose"),
    app = express();


// Expose config file
app.config = config;

// Database
require("./server/database")(app, mongoose);

// Bootstrap models
var models_path = __dirname + "/server/models";
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf(".js")) {
        require(models_path + "/" + file);
    }
});

// bootstrap passport config
require("./server/passport")(passport, config);

// Bootstrap express config
require("./server/express")(app, express, passport);

// Bootstrap routes
var routes_path = __dirname + "/server/routes";
fs.readdirSync(routes_path).forEach(function(file) {
    if (~file.indexOf(".js")) {
        require(routes_path + "/" + file)(app, express);
    }
});


// all environments
app.set("port", process.env.PORT || 3000);


// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
app.use(function(err, req, res, next) {
    // treat as 404
    if (err.message && (~err.message.indexOf("not found") || (~err.message.indexOf("Cast to ObjectId failed")))) {
        return next();
    }

    // error page
    res.status(500).render("partials/errors/500", {
        error: err.stack
    });
});

// assume 404 since no middleware responded
app.use(function(req, res) {
    res.status(404).render("partials/errors/404", {
        url: req.originalUrl,
        error: "Not found"
    });
});

app.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});

// Expose app
module.exports = app;