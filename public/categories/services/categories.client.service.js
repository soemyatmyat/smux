

angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('api/categories/:categoryId', {
			categoryId: '@_id'
		}, {
			update: {
				method: 'PUT',
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

