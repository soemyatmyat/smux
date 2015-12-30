//alert("service1");

angular.module('requests').factory('Requests', ['$resource',
	function($resource) {
		return $resource('api/requests/:project_id', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

