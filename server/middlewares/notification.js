/**
 * Ce module permet d"envoyer des mails
 *
 */
var nodemailer = require("nodemailer"),
    env = process.env.NODE_ENV || "development",
    config = require("../../config/config")[env],
    logger = require("../logger");

/**
 * Cette fonction permet d"envoyer un mail via Mailgun SMTP
 * @param mailOptions
 */
exports.sendMail = function(mailOptions) {

    var result = false;

    var transporter = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: config.gmail.user,
            pass: config.gmail.password
        }
    });

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            logger.error(error);
        } else {
            logger.info("send email to: " + mailOptions.to + " -> " + info.response);
        }
    });
    return result;
};

/**
 * Cette fonction envoie un mail lorsque un contact laisse un email
 * @param contact
 **/
exports.sendEmailNewContact = function(contact) {

    var mailOptions = {
        from: "Nextrun <no-reply@nextrun.fr>",
        to: "contact.nextrun@gmail.com",
        subject: "Un nouveau contact a été ajouté",
        text: "nouveau contact: " + contact.email + " type: " + contact.type
    };

    this.sendMail(mailOptions);
};

/**
 * Cette fonction envoie un mail lorsque un contact a perdu son mot de passe
 * @param user
 **/
exports.sendEmailPasswordReinitialized = function(email, newPassword) {

    var mailOptions = {
        from: "Nextrun <no-reply@nextrun.fr>",
        to: email,
        subject: "Changement de mot de passe",
        text: "Bonjour, Voici votre nouveau mot de passe: " + newPassword + " vous pourrez le modifier en allant dans les paramètres",
    };

    this.sendMail(mailOptions);
};

/**
 * Cette fonction envoie un mail lorsque un contact laisse un feedback
 * @param contact
 **/
exports.sendEmailNewFeedback = function(feedback) {

    var mailOptions = {
        from: feedback.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouveau feedback",
        text: "Nouveau feedback par: " + feedback.email + " , type: " + feedback.type.name + " , message: " + feedback.message + " , race id: " + feedback.raceId,
    };

    this.sendMail(mailOptions);
};