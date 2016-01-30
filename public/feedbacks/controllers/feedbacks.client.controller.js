//alert("client-controller");
angular.module('feedbacks').controller('FeedbacksController', ['$scope', 'Authentication', '$window', '$routeParams', '$location', 'Feedbacks',
    function($scope, Authentication, $window, $routeParams, $location, Feedbacks) {
    	
    	$scope.authentication = Authentication;

    	$scope.add = function() {
    		var newFeedback = new Feedbacks();
    		newFeedback.project_id = this.project._id;
    		newFeedback.feedback_text = this.feedback_text;
    		newFeedback.$save(function(response) {
    	       $location.path('projects/' + response.project_id);
    		}, function(errorResponse) {
    			$scope.error = errorResponse.data.message;
    		});
    	};

    	$scope.read = function() {
    		var projectId = $routeParams.projectId;       
            $scope.feedback = Feedbacks.get({
                project_id: projectId
            });
    	};

    }
]);


