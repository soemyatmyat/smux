//alert("service1");

angular.module('announcements').factory('Announcements', ['$resource',
	function($resource) {
		return $resource('api/announcements/:annocId', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

