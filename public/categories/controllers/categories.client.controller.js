
angular.module('categories').controller('CategoriesController', ['$scope', 'Authentication', '$window', '$uibModal', '$routeParams', '$location', 'Categories',
    function($scope, Authentication, $window, $uibModal, $routeParams, $location, Categories) {

        $scope.authentication = Authentication;
        $scope.list = function() {

            $scope.models = {
                selected: null,
                templates: [
                    {type: "category", id: 1}
                ],
                lists: {
                    "A": [
                        {
                            "type": "category",
                            "description": "aaa",
                            "id": "1"
                        },
                        {
                            "type": "category",
                            "description": "bbb",
                            "id": "2"
                        },
                        {
                            "type": "category",
                            "description": "ccc",
                            "id": "3"
                        }
                    ]
                }
            };
        };

        $scope.$watch('models.lists', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

    }   

]);
