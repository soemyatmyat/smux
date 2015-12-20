
angular.module('users').config(['$routeProvider', 
	function($routeProvider) {
		//alert("client route");
		$routeProvider.
		when('/users', {
			templateUrl: 'users/views/list-users.client.view.html'
		}).
		when('/users/create', {
			templateUrl: 'users/views/create-user.client.view.html'
		}).
		when('/users/:userId', {
			templateUrl: 'users/views/view-user.client.view.html'
		});
	}
]);