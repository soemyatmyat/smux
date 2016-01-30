
angular.module('projects').config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.
		when('/projects', {
			templateUrl: 'projects/views/list-projects.client.view.html'
		}).
		when('/projects/create', {
			templateUrl: 'projects/views/create-project.client.view.html'
		}).
		when('/projects/:projectId/', {
			templateUrl: 'projects/views/view-project.client.view.html'
		});
	}
]);