
var users = require('../../app/controllers/users.server.controller'),
	projects = require('../../app/controllers/projects.server.controller');

module.exports = function(app) {


	// list the existing users, C
	app.route('/api/projects')
		.get(users.requiresLogin, projects.list)
		.post(users.requiresLogin, projects.add);

	// R,U,D
	app.route('/api/projects/:projectId')
		.get(users.requiresLogin, projects.read)
		.put(users.requiresLogin, projects.update)
		.delete(users.requiresLogin, projects.delete);

};
