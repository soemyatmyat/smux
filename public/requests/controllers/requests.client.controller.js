angular.module('requests').controller('RequestsController', ['$scope', 'Authentication', '$window', '$routeParams', '$location', 'Requests', 
    function($scope, Authentication, $window, $routeParams, $location, Requests) {

        $scope.authentication = Authentication;
        $scope.categoryIncludes = ['Accounting', 'Arts', 'Capstone', 'IT', 'Social Psychology'];

        $scope.includeCategory = function(category) {
            if (category == 'Accounting') $scope.accounting = !$scope.accounting;
            if (category == 'Arts') $scope.arts = !$scope.arts;
            if (category == 'Capstone') $scope.capstone = !$scope.capstone;
            if (category == 'IT') $scope.it = !$scope.it;
            if (category == 'Social Psychology') $scope.social = !$scope.social;
            var i = $.inArray(category, $scope.categoryIncludes);
            if (i > -1) {
                $scope.categoryIncludes.splice(i, 1);
            } else {
                $scope.categoryIncludes.push(category);
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
            $scope.accounting = true;
            $scope.arts = true;
            $scope.capstone = true;
            $scope.it = true;
            $scope.social = true;
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
