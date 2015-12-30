
angular.module('requests').config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.
		when('/requests', {
			templateUrl: 'requests/views/list-requests.client.view.html'
		}).
		when('/requests/create', {
			templateUrl: 'requests/views/create-request.client.view.html'
		}).
		when('/requests/:project_id/:faculty_id', {
			templateUrl: 'requests/views/view-request.client.view.html'
		});
	}
]);