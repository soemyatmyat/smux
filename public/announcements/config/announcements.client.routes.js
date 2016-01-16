
angular.module('announcements').config(['$routeProvider',
	function($routeProvider) {
		
		$routeProvider.
		when('/announcements', {

			templateUrl: 'announcements/views/list-announcements.client.view.html'
		});
	}
]);