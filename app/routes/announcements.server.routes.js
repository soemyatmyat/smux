
var users = require('../../app/controllers/users.server.controller'),
	announcements = require('../../app/controllers/announcements.server.controller');

module.exports = function(app) {

	// list the existing users, C
	app.route('/api/announcements')
		.get(users.requiresLogin, announcements.list)
		.post(users.requiresLogin, announcements.add);

	// R,U,D
	app.route('/api/announcements/:announcId')
		.get(users.requiresLogin, announcements.read)
		.put(users.requiresLogin, announcements.update)
		.delete(users.requiresLogin, announcements.delete);

};
