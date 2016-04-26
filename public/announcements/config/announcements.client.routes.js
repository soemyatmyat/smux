
angular.module('announcements').config(['$routeProvider',
	function($routeProvider) {
		
		$routeProvider.
		when('/announcements', {
			templateUrl: 'announcements/views/list-announcements.client.view.html'
		}).
		when('/announcements/create', {
			templateUrl: 'announcements/views/create-announcement.client.view.html'
		}).
		when('/announcements/:announcId', {
			templateUrl: 'announcements/views/view-announcement.client.view.html'
		});
	}
]);

