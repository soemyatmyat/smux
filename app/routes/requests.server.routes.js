
var users = require('../../app/controllers/users.server.controller'),
	requests = require('../../app/controllers/requests.server.controller'),
	utilities = require('../../app/controllers/utilities.server.controller');

module.exports = function(app) {

	// list the existing requests, C
	app.route('/api/requests')
		.get(users.requiresLogin, requests.list)
		.post(users.requiresLogin, requests.add, utilities.sendEmail)
		.put(users.requiresLogin, requests.update)


	// R, D
	app.route('/api/requests/:project_id')
		.get(users.requiresLogin, requests.read);

};
