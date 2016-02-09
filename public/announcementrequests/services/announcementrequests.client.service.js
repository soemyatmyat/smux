//alert("service1");

angular.module('announcementrequests').factory('AnnouncementRequests', ['$resource',
	function($resource) {
		return $resource('api/announcementrequests/:announc_id', {
			announc_id: '@_id'
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

