
var users = require('../../app/controllers/users.server.controller'),
	categories = require('../../app/controllers/categories.server.controller');

module.exports = function(app) {

	// list the existing users, C
	app.route('/api/categories')
		.get(users.requiresLogin, categories.list)
		.post(users.requiresLogin, categories.add);

	// U,D
	app.route('/api/projects/:projectId')
		.put(users.requiresLogin, categories.update)
		.delete(users.requiresLogin, categories.delete);

};
