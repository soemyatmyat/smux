
angular.module('requests').controller('RequestsController', ['$scope', 'Authentication', '$window', '$routeParams', '$location', 'Requests', 
    function($scope, Authentication, $window, $routeParams, $location, Requests) {

        $scope.authentication = Authentication;

        $scope.accept = function(request) {
            var acceptRequest = $window.confirm('Are you sure you want to accept this Request?');   
            
            request.$update(function(response) {
                $location.path('projects/' + response._id);   
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.list = function() {
            $scope.requests = Requests.query();
        };

		$scope.add = function() {;
            var newRequest = new Requests();
            newRequest.course_code = this.course_code;
            newRequest.project_id = this.project._id;
            newRequest.message = this.message;
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




