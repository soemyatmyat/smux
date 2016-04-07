//alert("client-controller");
angular.module('projects').controller('ProjectsController', ['$scope', 'Authentication', '$window', '$uibModal', '$routeParams', '$location', 'Projects',
    function($scope, Authentication, $window, $uibModal, $routeParams, $location, Projects) {
    	
    	$scope.authentication = Authentication;
    	$scope.statusIncludes = ['open'];
    	$scope.categoryIncludes = ['Accounting', 'Arts', 'Capstone', 'IT', 'Social Psychology'];

    	$scope.includeStatus = function(status) {
    		//alert("filterText");
    		if (status == 'On-Going') $scope.ongoing = !$scope.ongoing;
    		if (status == 'open') $scope.open = !$scope.open;
    		if (status == 'Completed') $scope.completed = !$scope.completed;
    		if (status == 'requested') $scope.requested = !$scope.requested;
    		var i = $.inArray(status, $scope.statusIncludes);
    		if (i > -1) {
    			$scope.statusIncludes.splice(i, 1);
    		} else {
    			$scope.statusIncludes.push(status);
    		}
    	}

        $scope.statusFilter = function(project) {  
        	if ($scope.statusIncludes.length > 0) {
        		if ($.inArray(project.status, $scope.statusIncludes) < 0) {
        			return;
        		} else {
        			return project;
        		}
        	} else {
        		return;
        	}
        }

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

        $scope.categoryFilter = function(project) {  
        	if ($scope.categoryIncludes.length > 0) {
        		if ($.inArray(project.category, $scope.categoryIncludes) < 0) {
        			return;
        		} else {
        			return project;
        		}
        	} else {
        		return;
        	}
        }

    	$scope.openModal = function() {
    		var modalInstance = $uibModal.open ({
    			templateUrl: 'request.html',
    			controller: 'ModalInstanceCtrl',
    			resolve: {
    				project: function() {
    					return $scope.project;
    				}
    			}
    		});
    	};

    	$scope.openFeedback = function() {
    		var modalInstance = $uibModal.open ({
    			templateUrl: 'feedback.html',
    			controller: 'ModalInstanceCtrl',
    			resolve: {
    				project: function() {
    					return $scope.project;
    				}
    			}
    		});
    	}

    	$scope.toggleBtn = function(category,id){
			$("." +category + id).text(function(i, text){
	          return text === "View More" ? "View Less" : "View More";
	      });
		};
		
    	$scope.update = function() {
            $scope.edit = !$scope.edit;
            var yyyy;
            var mm;
            var dd;
            if($scope.start_date != null){
                yyyy = $scope.project.start_date.getFullYear().toString();
                mm = ($scope.project.start_date.getMonth()+1).toString(); // getMonth() is zero-based
                dd  = $scope.project.start_date.getDate().toString();
                $scope.project.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            }

            if ($scope.end_date != null) {
                yyyy = $scope.project.end_date.getFullYear().toString();
                mm = ($scope.project.end_date.getMonth()+1).toString(); // getMonth() is zero-based
                dd  = $scope.project.end_date.getDate().toString();
                $scope.project.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            }

            $scope.project.$update(function(response) {
                $window.alert('Updated Successfully!');
                //$location.path('projects/' + $scope.project._id);
		    	$location.path('projects/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    	$scope.delete = function(project) {
			var deleteProject = $window.confirm('Are you sure you want to withdrawal the Project?');
			
			if (deleteProject) {
				project.$remove(function(response) {
					$location.path('projects/')
				}, function(errorResponse) {
		    		$scope.error = errorResponse.data.message;
				});
			}
    	}
        //alert("client-controller2");
        //$scope.filteredProjects = [],
        $scope.currentPage = 1,
        $scope.itemsPerPage = 5,
      	$scope.maxSize = 5;

        $scope.list = function() {
        	$scope.open= true;
        	$scope.ongoing = false;
        	$scope.completed = false;
        	$scope.requested = false;
        	$scope.accounting = true;
        	$scope.arts = true;
        	$scope.capstone = true;
        	$scope.it = true;
        	$scope.social = true;
            $scope.projects = Projects.query();
        };

        /*
		$scope.$watch('currentPage + numPerPage', function() {
			//alert('hello');
			var begin = (($scope.currentPage - 1) * $scope.numPerPage), 
				end = begin + $scope.numPerPage;
			//alert(begin);
			//alert($scope.projects);
			$scope.filteredProjects = $scope.projects.slice(begin, end);
		});*/

        $scope.read = function() {
            $scope.project = Projects.get({
                projectId: $routeParams.projectId
            });
        };

		$scope.add = function() {
			var newProject = new Projects();
			newProject.title = this.title;
			newProject.category = this.category;
			if(this.start_date != null){
				var yyyy = this.start_date.getFullYear().toString();
				var mm = (this.start_date.getMonth()+1).toString(); // getMonth() is zero-based
				var dd  = this.start_date.getDate().toString();
				newProject.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
				
			}

			if(this.end_date != null){
				yyyy = this.end_date.getFullYear().toString();
				mm = (this.end_date.getMonth()+1).toString(); // getMonth() is zero-based
				dd  = this.end_date.getDate().toString();
				newProject.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
					
			}
			newProject.contact_person = this.contact_person;
			newProject.contact_email = this.contact_email;
			newProject.contact_HP = this.contact_HP;
			newProject.description = this.description;
			//if (nweProject.hp === undefined) {newProject.hp = null}
			newProject.$save(function(response) {
		    	$location.path('projects/');
			}, function(errorResponse) {
			    $scope.error = errorResponse.data.message;
			});
		}		

		// Disable weekend selection
		$scope.disabled = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};

		$scope.toggleMin();

		$scope.open = function($event) {
			$scope.status.opened = true;
		};

		$scope.setDate = function(year, month, day) {
			$scope.dt = new Date(year, month, day);
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.status = {
			opened: false
		};

		$scope.getDayClass = function(date, mode) {
			if (mode === 'day') {
			  var dayToCheck = new Date(date).setHours(0,0,0,0);

			  for (var i=0;i<$scope.events.length;i++){
			    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

			    if (dayToCheck === currentDay) {
			      return $scope.events[i].status;
			    }
			  }
			}

			return '';
		};

    }
]);

angular.module('projects').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, project) {

	$scope.project = project;

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

});

