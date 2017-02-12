var _ = require('underscore')
,userRoles = require('../../public/js/client/routingConfig').userRoles
,accessLevels = require('../../public/js/client/routingConfig').accessLevels;


exports.ensureAuthorized = function (req, res, next) {
    /*if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        //req.flash('warning', "Vous n'êtes pas autoriser à effectuer cette action");
      	//return res.redirect("/");
        return res.send(403);
    }
    next();
    */

    
    var routes = [

        { path: "/users/signup" , accessLevel: accessLevels.public},
        { path: "/users/session" , accessLevel: accessLevels.public},
        { path: "/users/forgotpassword" , accessLevel: accessLevels.public},
        { path: "/users/logout" , accessLevel: accessLevels.public},
        { path: "/users/check/email" , accessLevel: accessLevels.public},
        { path: "/users/:userId" , accessLevel: accessLevels.public},
        { path: "/users/:userId/update/profile" , accessLevel: accessLevels.public},
        { path: "/users/:userId/update/password" , accessLevel: accessLevels.public},
        { path: "/contacts" , accessLevel: accessLevels.public},
        { path: "/users/settings" , accessLevel: accessLevels.user},
        { path: "/partials/user/*" , accessLevel: accessLevels.user},
        { path: "/partials/race/*" , accessLevel: accessLevels.public},
        { path: "/users" , accessLevel: accessLevels.public},
        { path: "/races" , accessLevel: accessLevels.public}

    ]

    var role;
    if(!req.user) role = userRoles.public;
    else          role = req.user.role;
    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;

    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
    
};