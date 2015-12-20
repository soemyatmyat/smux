//alert("service1");

angular.module('users').factory('Users', ['$resource',
	function($resource) {
		//alert("service2");
		return $resource('api/users/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

