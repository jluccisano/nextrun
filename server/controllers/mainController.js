var cookie = require("../../config/middlewares/cookie");
/*
 * GET home page.
 */

exports.index = function(req, res) {

    cookie.setUserCookie(req, res);

    res.render("index", {
        title: "Accueil"
    });

};

exports.partials = function(req, res) {
    var name = req.params.name;
    var type = req.params.type;

    var partial = "partials/" + name;

    if (type) {
        partial = "partials/" + type + "/" + name;
    }

    res.render(partial);
};