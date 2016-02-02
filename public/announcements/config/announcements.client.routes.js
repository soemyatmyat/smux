
angular.module('announcements').config(['$routeProvider',
	function($routeProvider) {
		
		$routeProvider.
		when('/announcements', {
			templateUrl: 'announcements/views/list-announcements.client.view.html'
		}).
		when('/announcements/create', {
			templateUrl: 'announcements/views/create-announcements.client.view.html'
		}).
		when('/announcements/:announcId', {
			templateUrl: 'announcements/views/view-announcements.client.view.html'
		});
	}
]);

