angular.module('categories').config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.
		when('/categories', {
			templateUrl: 'categories/views/list-categories.client.view.html'
		});
	}
]);