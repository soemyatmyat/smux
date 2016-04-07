
angular.module('categories').controller('CategoriesController', ['$scope', 'Authentication', '$window', '$uibModal', '$routeParams', '$location', 'Categories',
    function($scope, Authentication, $window, $uibModal, $routeParams, $location, Categories) {

    	$scope.authentication = Authentication;

    	$scope.list = function() {
    		$scope.categories = {
                selected: null,
    			lists: {"A": []}
    		}

    		alert($scope.categories.lists.A);

    		for (var i = 1; i <= 8; i++) {
    			$scope.categories.lists.A.push({label: "Item " + i});
    		}
    	};

    	$scope.$watch('categories', function(categories) {
        	$scope.modelAsJson = angular.toJson(categories, true);
    	}, true);
    }

]);
