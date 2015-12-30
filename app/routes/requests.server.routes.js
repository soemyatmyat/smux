
var users = require('../../app/controllers/users.server.controller'),
	requests = require('../../app/controllers/requests.server.controller');

module.exports = function(app) {

	// list the existing requests, C
	app.route('/api/requests')
		.get(users.requiresLogin, requests.list)
		.post(users.requiresLogin, requests.add);


	// R, D
	app.route('/api/requests/:project_id')
		.get(users.requiresLogin, requests.read)
		.delete(users.requiresLogin, requests.delete);


};
