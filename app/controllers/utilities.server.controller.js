console.log("utilites.server.controller");
/////////////////
// Send Email //
///////////////
exports.sendEmail = function(req, res) {
	var mailOpts, smtpTrans;
	var nodemailer = require('nodemailer');

	smtpTrans = nodemailer.createTransport('smtps://smuxauto@gmail.com:p9fkMuXh@smtp.gmail.com');
	// Mail Options
	mailOpts = {
		from: "smuxauto@gmail.com",
		to: "smuxauto@gmail.com", //this to be replace with project's owner's mail address
		subject: "SMUX - Project Request",
		text: req.body.message
	};

	smtpTrans.sendMail(mailOpts, function(error, response) {
		if (error) {
			console.log("Mail sending error: " + error);
		} else {
			console.log("Mail Sent!");
		}
	});
}