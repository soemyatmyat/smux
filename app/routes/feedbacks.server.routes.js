
var users = require('../../app/controllers/users.server.controller'),
	feedbacks = require('../../app/controllers/feedbacks.server.controller');

module.exports = function(app) {


	// list the existing users, C
	app.route('/api/feedbacks')
		//.get(users.requiresLogin, feedbacks.list)
		.post(users.requiresLogin, feedbacks.add);

	// R,U,D
	app.route('/api/feedbacks/:project_id')
		.get(users.requiresLogin, feedbacks.read);/*
		.put(users.requiresLogin, feedbacks.update)
		.delete(users.requiresLogin, feedbacks.delete);*/

};
