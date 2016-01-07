
angular.module('requests').config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.
		when('/requests', {
			templateUrl: 'requests/views/list-requests.client.view.html'
		});
	}
]);