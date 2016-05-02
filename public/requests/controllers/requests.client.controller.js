angular.module('requests').controller('RequestsController', ['$scope', 'Authentication', '$window', '$routeParams', '$location', 'Requests', 'Categories',
    function($scope, Authentication, $window, $routeParams, $location, Requests, Categories) {

        $scope.authentication = Authentication;
        $scope.categoryIncludes = ['Accounting', 'Arts', 'Capstone', 'IT', 'Social Psychology'];

        $scope.includeCategory = function(category) {
            if ($scope[category.short_form] === undefined) {
                $scope[category.short_form] = true;
            } else {
                $scope[category.short_form] = !$scope[category.short_form];
            }
            var i = $.inArray(category.description, $scope.categoryIncludes);
            if (i > -1) {
                $scope.categoryIncludes.splice(i, 1);
            } else {
                $scope.categoryIncludes.push(category.description);
            }
        }

        $scope.categoryFilter = function(request) {  
            if ($scope.categoryIncludes.length > 0) {
                if ($.inArray(request.category, $scope.categoryIncludes) < 0) {
                    return;
                } else {
                    return request;
                }
            } else {
                return;
            }
        }

        $scope.accept = function(request) {
            var acceptRequest = $window.confirm('Are you sure you want to accept this Request?');   
            
            request.$update(function(response) {
                $location.path('projects/' + response._id);   
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.list = function() {
            $scope.categories = Categories.query();
            $scope.requests = Requests.query();
        };

        $scope.add = function() {;
            var newRequest = new Requests();
            newRequest.course_code = this.course_code;
            newRequest.project_id = this.project._id;
            newRequest.message = this.message;
            newRequest.title = this.project.title;
            newRequest.$save(function(response) {
                $location.path('projects/' + response.project_id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.read = function() {
            var projectId = $routeParams.projectId;            
            $scope.request = Requests.get({
                project_id: projectId,
                faculty_id: $scope.authentication.user._id
            });
        };

    }
]);
