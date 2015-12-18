
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {

	// login
	app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
        	successRedirect: '/',
        	failureRedirect: '/login'
        }));
        /*.post(passport.authenticate('local'), function(req,res) { console.log("here2")});*/
	
	// logout
	app.get('/logout', users.logout);

	// list the existing users, create a new user
	app.route('/users').get(users.list);

	// add a new user
	app.route('/add').get(users.register).post(users.add);

	// 
	//app.route('/users/:username').get(users.read).put(users.update).delete(users.delete);
	app.route('/:username').get(users.read).post(users.update);

};
