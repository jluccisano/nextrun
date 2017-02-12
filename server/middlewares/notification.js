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

    var transporter = nodemailer.createTransport({
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

    var message = "Nouveau feedback par: " + feedback.email + " , type: " + feedback.type.name + " , message: " + feedback.message;

    if (feedback.raceId) {
        message = message + " , race id: " + feedback.raceId;
    }

    var mailOptions = {
        from: feedback.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouveau feedback",
        text: message
    };

    this.sendMail(mailOptions);
};

exports.sendNewSession = function(user) {

    var mailOptions = {
        from: user.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouvel session",
        text: "Nouvel session: " + user.id + " , username: " + user.username + " , email: " + user.email
    };

    this.sendMail(mailOptions);
};

exports.sendNewUser = function(user) {

    var mailOptions = {
        from: user.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouvel utilisateur",
        text: "Nouvel utilisateur: " + user.id + " , username: " + user.username + " , email: " + user.email
    };

    this.sendMail(mailOptions);
};

exports.sendNewRace = function(race, user) {

    var mailOptions = {
        from: user.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouvel course",
        text: "Nouvel course: " + user.id + " , username: " + user.username + " , email: " + user.email + " , race: " + race._id + " , raceName: " + race.name
    };

    this.sendMail(mailOptions);
};

exports.sendNewRoute = function(route, user) {

    var mailOptions = {
        from: user.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouveau parcours",
        text: "Nouveau parcours: " + user.id + " , username: " + user.username + " , email: " + user.email + " , route: " + route._id + " , routeName: " + route.name
    };

    this.sendMail(mailOptions);
};

exports.sendNewWorkout = function(route, user) {

    var mailOptions = {
        from: user.email,
        to: "contact.nextrun@gmail.com",
        subject: "Nouvelle sortie",
        text: "Nouvelle sortie: " + user.id + " , username: " + user.username + " , email: " + user.email + " , route: " + route._id + " , routeName: " + route.name
    };

    this.sendMail(mailOptions);
};

exports.sendNotificationToParticipant = function(workout, user, participant) {

    var mailOptions = {
        from: user.email,
        to: participant.email,
        subject: "Nouvelle sortie",
        text: "http://localhost:3000/workouts/" + workout._id + "/participants/" + participant._id
    };

    this.sendMail(mailOptions);
};

exports.sendNotificationToOwner = function(workout, workoutOwner, participant) {

    var mailOptions = {
        from: "contact.nextrun@gmail.com",
        to: user.email,
        subject: "Modification de votre sortie",
        text: "Votre sortie a été mis à jour http://localhost:3000/workouts/" + workout._id + " par le participant" + participant.email
    };

    this.sendMail(mailOptions);
};