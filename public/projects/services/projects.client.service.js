//alert("service1");

angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('api/projects/:projectId', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			get: {
				transformResponse: transformResponse
			}
		});

		function transformResponse(data) {
			data = angular.fromJson(data);
			if (data.start_date != null) data.start_date = new Date(data.start_date);
			if (data.end_date != null) data.end_date = new Date(data.end_date);
			return data;
		}
	}
]);

