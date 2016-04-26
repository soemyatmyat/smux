
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

            $scope.models.lists.A = Categories.query();
            $scope.origin = Categories.query();



        };

        $scope.$watch('models.lists', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);


        $scope.update = function(sth) {

            var originIds = [];
            for (var i = 0; i < $scope.origin.length; i++) {
                originIds.push($scope.origin[i]._id);
            }

            // update & add
            var category = new Categories();
            var categoriesList = [];
            for (var i = 0; i < sth.A.length; i++) {
                var category = new Categories();
                category._id = sth.A[i]._id;
                category.description = sth.A[i].description;
                category.order_id = i+1;
                categoriesList.push(category);
            }


            for (var i = 0; i < categoriesList.length; i++) {
                if (originIds.indexOf(categoriesList[i]._id) > -1) {
                    originIds.splice(originIds.indexOf(categoriesList[i]._id),1);
                }
                categoriesList[i].$update(function(response) {
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }

            // delete
            var deleteCategories = [];
            for (var i = 0; i < originIds.length; i++) {
                var category = new Categories();
                category._id = originIds[i];
                deleteCategories.push(category);
            }

            for (var i = 0; i < deleteCategories.length; i++) {
                deleteCategories[i].$remove(function(response) {
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }

            $location.path('categories/');

        };


    }   

]);
