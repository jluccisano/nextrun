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
    } else if (feedback.workoutId) {
        message = message + " , workout id: " + feedback.workoutId;
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
        from: "contact.nextrun@gmail.com",
        to: "contact.nextrun@gmail.com",
        subject: "Nouvel session",
        text: "Nouvel session: " + user.id + " , username: " + user.username + " , email: " + user.email
    };

    this.sendMail(mailOptions);
};

exports.sendNewUser = function(user) {

    var mailOptions = {
        from: "contact.nextrun@gmail.com",
        to: "contact.nextrun@gmail.com",
        subject: "Nouvel utilisateur",
        text: "Nouvel utilisateur: " + user.id + " , username: " + user.username + " , email: " + user.email
    };

    this.sendMail(mailOptions);
};

exports.sendNewRace = function(race, user) {

    var mailOptions = {
        from: "contact.nextrun@gmail.com",
        to: "contact.nextrun@gmail.com",
        subject: "Nouvel course",
        text: "Nouvel course: " + user.id + " , username: " + user.username + " , email: " + user.email + " , race: " + race._id + " , raceName: " + race.name
    };

    this.sendMail(mailOptions);
};

exports.sendNewRoute = function(route, user) {

    var mailOptions = {
        from: "contact.nextrun@gmail.com",
        to: "contact.nextrun@gmail.com",
        subject: "Nouveau parcours",
        text: "Nouveau parcours: " + user.id + " , username: " + user.username + " , email: " + user.email + " , route: " + route._id + " , routeName: " + route.name
    };

    this.sendMail(mailOptions);
};


/** workout management **/

exports.sendNewWorkout = function(route, user) {

    var url = "http://nextrun.fr/workouts/" + workout._id;

    var templateHtml = "<p>Félicitation " + user.username + " !</p>" +
        "<p>Vous venez de créer la sortie Nextrun \"<b>" + workout.name + "</b>\". Un email a été envoyé à toutes les personnes que vous avez invité</p>" +
        "<p>Vous pouvez à tout moment modifier votre sortie en cliquant sur ce lien<a href=\"" + url + "\">Voir la sortie</a></p>" +
        "<hr>" +
        "<small>Nextrun est un site qui permet d'organiser des sorties sportives avec des groupes de personnes. <a href=\"nextrun.fr\">en savoir plus sur Nextrun</a></small>";

    var mailOptions = {
        from: "contact.nextrun@gmail.com",
        to: user.email,
        subject: "Nouvelle sortie",
        text: "Nouvelle sortie: " + user.id + " , username: " + user.username + " , email: " + user.email + " , route: " + route._id + " , routeName: " + route.name,
        html: templateHtml
    };

    this.sendMail(mailOptions);
};

exports.sendNotificationToParticipant = function(workout, user, participant) {

    var url = "http://nextrun.fr/workouts/" + workout._id + "/participants/" + participant._id;

    var templateHtml = "<p>Bonjour,</p>" +
        "<p>" + user.username + " vous invite à participer à la sortie Nextrun \"<b>" + workout.name + "</b>\".</p>" +
        "<a href=\"" + url + "\">Répondre maintenant</a>" +
        "<hr>" +
        "<small>Nextrun est un site qui permet d'organiser des sorties sportives avec des groupes de personnes. <a href=\"nextrun.fr\">en savoir plus sur Nextrun</a></small>";

    var mailOptions = {
        from: user.username + " (via Nextrun) <contact.nextrun@gmail.com>",
        to: participant.email,
        subject: "Nouvelle sortie",
        text: url,
        html: templateHtml
    };


    this.sendMail(mailOptions);
};

exports.sendNotificationUpdateToParticipant = function(workout, user, participant) {

    var url = "http://nextrun.fr/workouts/" + workout._id + "/participants/" + participant._id;

    var templateHtml = "<p>Bonjour,</p>" +
        "<p>" + user.username + " a mis à jour la sortie Nextrun \"<b>" + workout.name + "</b>\".</p>" +
        "<a href=\"" + url + "\">Voir maintenant</a>" +
        "<hr>" +
        "<small>Nextrun est un site qui permet d'organiser des sorties sportives avec des groupes de personnes. <a href=\"nextrun.fr\">en savoir plus sur Nextrun</a></small>";

    var mailOptions = {
        from: user.username + " (via Nextrun) <contact.nextrun@gmail.com>",
        to: participant.email,
        subject: "Nouvelle sortie",
        text: url,
        html: templateHtml
    };

    this.sendMail(mailOptions);
};

exports.sendNotificationToOwner = function(workout, workoutOwner, participant) {

    var url = "http://nextrun.fr/workouts/" + workout._id;

    var templateHtml = "<p>Bonjour,</p>" +
        "<p>" + participant.pseudo + " a répondu à votre sortie Nextrun \"<b>" + workout.name + "</b>\".</p>" +
        "<a href=\"" + url + "\">Voir maintenant</a>" +
        "<hr>" +
        "<small>Nextrun est un site qui permet d'organiser des sorties sportives avec des groupes de personnes. <a href=\"nextrun.fr\">en savoir plus sur Nextrun</a></small>";

    var mailOptions = {
        from: "contact.nextrun@gmail.com",
        to: workoutOwner.email,
        subject: "Modification de votre sortie",
        text: "Votre sortie a été mis à jour http://localhost:3000/workouts/" + workout._id + " par le participant" + participant.pseudo,
        html: templateHtml
    };

    this.sendMail(mailOptions);
};