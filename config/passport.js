var passport = require('passport'),
	mysql = require('./mysql');

module.exports = function() {
	// how passport will handle user serialization
	// when a user is authenticated, passport will save its _id prpoerty to session
	passport.serializeUser(function(user,done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(_id, done) {
		var db = mysql();
		db.connect(function(err, results) {});
		db.query("SELECT _id, name, email_address, role FROM `users` WHERE `_id` = '" + _id + "'", function(err,rows){
			done(err, rows[0]);
		})
		db.end();
	});

	require('./strategies/local.js')();
}