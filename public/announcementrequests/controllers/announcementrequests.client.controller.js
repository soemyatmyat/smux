
angular.module('announcementrequests').controller('AnnouncementRequestsController', ['$scope', 'Authentication', '$window', '$routeParams', '$location', 'AnnouncementRequests', 
    function($scope, Authentication, $window, $routeParams, $location, AnnouncementRequests) {

        $scope.authentication = Authentication;
        

        $scope.accept = function(announcementrequest) {
            var acceptRequest = $window.confirm('Are you sure you want to accept this Request?');   
            
            announcementrequest.$update(function(response) {
                $location.path('announcements/' + response._id);   
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.list = function() {
            //console.log("hello");
            $scope.announcementrequests = AnnouncementRequests.query();
            //console.log($scope.announcementrequests);
        };

		$scope.add = function() {;
            $scope.announcement_id = $window.announcementId;
            var newRequest = new AnnouncementRequests();
            newRequest.project_id = this.projectId;
            newRequest.announcement_id = $scope.announcement_id;
            newRequest.description = this.description;
            newRequest.$save(function(response) {
                $location.path('announcements/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.read = function() {
            var projectId = $routeParams.projectId;            
            $scope.announcementrequest = AnnouncementRequests.get({
                announc_id: announc_id,
                faculty_id: $scope.authentication.user._id
            });
        };

    }
]);




