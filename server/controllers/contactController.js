var mongoose = require("mongoose"),
    Contact = mongoose.model("Contact"),
    errorUtils = require("../utils/errorUtils"),
    email = require("../middlewares/notification"),
    logger = require("../logger"),
    mongooseUtils = require("../utils/mongooseUtils"),
    underscore = require("underscore");

/**
 * Load By Id
 */
exports.load = function(req, res, next, id) {
    mongooseUtils.load(req, res, next, id, Contact, "contact");
    /*Contact.load(id, function(error, contact) {
        if (error) {
            errorUtils.handleError(res, error);
        } else if (!contact) {
            errorUtils.handleUnknownId(res);
        } else {
            req.contact = contact;
            next();
        }
    });*/
};

/**
 * @method find route
 * @param req
 * @param res
 * @returns route loaded by parameter id
 */
exports.find = function(req, res) {
    mongooseUtils.find(req,res,"contact");
    /*var contact = req.contact;
    if (!underscore.isUndefined(contact)) {
        res.status(200).json(contact);
    } else {
        errorUtils.handleUnknownData(res);
    }*/
};

/**
 * Create
 */
exports.create = function(req, res) {
    var contact = new Contact(req.body);
    contact.save(function(err) {
        if (!err) {
            email.sendEmailNewContact(contact);
            return res.sendStatus(200);
        } else {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
    });
};

/**
 * Send a feedback
 * email, type (bug,Information erronée,dupliquer,autre), message
 */
exports.feedback = function(req, res) {

    var feedback;

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.feedback)) {
        feedback = req.body.feedback;
        email.sendEmailNewFeedback(feedback);
        return res.sendStatus(200);
    } else {
        logger.error("error.occured");
        return res.status(400).json({
            message: ["error.occured"]
        });
    }
};


exports.update = function(req, res) {
    var contact = req.contact;
    var dataToUpdate = req.body;

    if (dataToUpdate._id) {
        delete dataToUpdate._id;
    }
    dataToUpdate.lastUpdate = new Date();

    Contact.update({
        _id: contact._id
    }, {
        $set: dataToUpdate
    }, {
        upsert: true
    }, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * @method find
 * @param req
 * @param res
 * @returns success if OK
 */
exports.findAll = function(req, res) {
    var page = 1;
    var perPage = 10;
    var criteria = {};

    if (req.params.page) {
        page = req.params.page;
    }

    var options = {
        perPage: perPage,
        page: page - 1,
        criteria: criteria
    };

    Contact.findByCriteria(options, function(error, contacts) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.status(200).json({
                items: contacts
            });
        }
    });
};

/**
 * @method delete route
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    var contact = req.contact;
    mongooseUtils.delete(req, res, contact._id, Contact);

    /*Contact.destroy(contact._id, function(error) {
        if (error) {
            errorUtils.handleError(res, error);
        } else {
            res.sendStatus(200);
        }
    });*/
};