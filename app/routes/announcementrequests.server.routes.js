
var users = require('../../app/controllers/users.server.controller'),
	announcementrequests = require('../../app/controllers/announcementrequests.server.controller');
	utilities = require('../../app/controllers/utilities.server.controller');


module.exports = function(app) {

	// list the existing requests, C
	app.route('/api/announcementrequests')
		.get(users.requiresLogin, announcementrequests.list)
		.post(users.requiresLogin, announcementrequests.add, utilities.sendEmail)
		.put(users.requiresLogin, announcementrequests.update);


	// R, D
	app.route('/api/announcementrequests/:announcement_id')
		.get(users.requiresLogin, announcementrequests.read)
		.put(users.requiresLogin, announcementrequests.update);

};
