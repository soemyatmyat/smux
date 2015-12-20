
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {

	// login
	app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
        	successRedirect: '/',
        	failureRedirect: '/login',
        	failureFlash: true
        }));
        /*.post(passport.authenticate('local'), function(req,res) { console.log("here2")});*/
	
	// logout
	app.get('/logout', users.logout);

	// list the existing users, C
	app.route('/api/users')
		.get(users.list)
		.post(users.requiresLogin, users.add);

	// R,U,D
	app.route('/api/users/:userId')
		.get(users.requiresLogin, users.read)
		.put(users.requiresLogin, users.update)
		.delete(users.requiresLogin, users.delete);

};
