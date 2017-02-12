exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('warning', "Vous n'êtes pas autoriser à effectuer cette action");
      	return res.redirect("/");
    }
    next();
};