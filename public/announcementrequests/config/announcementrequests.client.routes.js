
angular.module('announcementrequests').config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.
		when('/announcementrequests', {
			templateUrl: 'announcementrequests/views/list-announcementrequests.client.view.html'
		});
	}
]);