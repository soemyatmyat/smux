
angular.module('categories').controller('CategoriesController', ['$scope', 'Authentication', '$window', '$uibModal', '$routeParams', '$location', 'Categories',
    function($scope, Authentication, $window, $uibModal, $routeParams, $location, Categories) {

        $scope.authentication = Authentication;
        $scope.list = function() {

            $scope.models = {
                selected: null,
                templates: [
                    {type: "category", description: "New Category",_id: 0}
                ],
                lists: {
                    "A": []
                }
            };

            //$scope.models.lists = Projects.query();
            // alert($scope.models.lists.A);
            $scope.models.lists.A = Categories.query();
            //alert($scope.models.lists.A);

        };

        $scope.$watch('models.lists', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);


        $scope.update = function(sth) {
            var category = new Categories();
            for (var i = 0; i < sth.A.length; i++) {
                category._id = sth.A[i]._id;
                category.description = sth.A[i].description;
                category.order_id = i+1;
                category.$save(function(response) {
                    $window.alert('Updated Successfully!');
                    $location.path('categories/');
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }

        };


    }   

]);
