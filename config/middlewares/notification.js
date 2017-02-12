/**
* Ce module permet d'envoyer des mails
*
*/
var nodemailer = require("nodemailer");

/**
* Cette fonction permet d'envoyer un mail via Mailgun SMTP
* @param mailOptions
* @return 
*/
exports.sendMail = function(mailOptions) {

	var transport = nodemailer.createTransport("SMTP",{
	    service: "Mailgun",
	    auth: {
	        user: env.mailgun.user,
	        pass: env.mailgun.pass
	        //user: "webmaster@sportevents.mailgun.org",
			//pass: "0r5qtpq09vz7"
	    }
	});

	transport.sendMail(mailOptions, function(err, res) {
	  if (err) {
	  	console.log(err);
	  } else {
	  	console.log("send email to: " + mailOptions.to +" -> success");
	  }	
	});

};

/**
* Cette fonction envoie un mail lorsque un contact laisse un email
* @param contact
* @return 
**/
exports.sendEmailNewContact = function(contact) {

	var mailOptions = {
	  from: "no-reply@sportevents.mailgun.org",
	  to: "webmaster@sportevents.mailgun.org",
	  subject: "Un nouveau contact a été ajouté",
	  text: "nouveau contact: " + contact.email + " type: " + contact.type,
	};

	this.sendMail(mailOptions);
};


