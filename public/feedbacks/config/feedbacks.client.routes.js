
angular.module('feedbacks').config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.
		when('/feedbacks', {
			templateUrl: 'projects/views/list-projects.client.view.html'
		}).
		when('/feedbacks/create', {
			templateUrl: 'projects/views/create-project.client.view.html'
		}).
		when('/feedbacks/:projectId', {
			templateUrl: 'projects/views/view-project.client.view.html'
		});
	}
]);