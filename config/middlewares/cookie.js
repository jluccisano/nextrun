"use strict";

/**
 * Module dependencies.
 */

var userRoles = require("../../client/routingConfig").userRoles;

/**
 * Cookie middleware
 */

module.exports = {

    /**
     * Set a cookie for angular so it knows we have an http session
     */

    setUserCookie: function(req, res) {

        var role = userRoles.public,
            username = "",
            email = "",
            id = "";
        if (req.user) {
            id = req.user._id;
            role = req.user.role;
            username = req.user.username;
            email = req.user.email;
        }
        res.cookie("user", JSON.stringify({
            "id": id,
            "email": email,
            "username": username,
            "role": role
        }));

    }
};