//alert("service1");

angular.module('feedbacks').factory('Feedbacks', ['$resource',
	function($resource) {
		return $resource('api/feedbacks/:project_id', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

