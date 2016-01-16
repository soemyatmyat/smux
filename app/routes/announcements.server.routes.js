
var users = require('../../app/controllers/users.server.controller'),
	announcements = require('../../app/controllers/announcements.server.controller');

module.exports = function(app) {


	// list the existing announcement, C
	app.route('/api/announcements')
		.get(users.requiresLogin, announcements.list)
		.post(users.requiresLogin, announcements.add);
		alert('hello');
	// R,U,D
	app.route('/api/announcements/:annocId')
		.get(users.requiresLogin, announcements.read)
		.put(users.requiresLogin, announcements.update)
		.delete(users.requiresLogin, announcements.delete);

};