var passport = require('passport'),
	mysql = require('./mysql');

module.exports = function() {
	// how passport will handle user serialization
	// when a user is authenticated, passport will save its _id prpoerty to session
	passport.serializeUser(function(user,done) {
		done(null, user.email_address);
	});

	passport.deserializeUser(function(email_address, done) {
		var db = mysql();
		db.connect(function(err, results) {});
		db.query("SELECT name, email_address, role FROM `users` WHERE `email_address` = '" + email_address + "'", function(err,rows){
			done(err, rows[0]);
		})
		db.end();
	});

	require('./strategies/local.js')();
}