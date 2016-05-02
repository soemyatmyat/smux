//alert("client-controller");
angular.module('projects',['ngFileUpload']).controller('ProjectsController', ['$scope', 'Authentication', 'Upload', '$window', '$uibModal', '$routeParams', '$location', 'Projects', 'Categories',
    function($scope, Authentication, Upload,  $window, $uibModal, $routeParams, $location, Projects, Categories) {
    	
    	$scope.authentication = Authentication;
    	$scope.statusIncludes = ['open'];
    	$scope.categoryIncludes = ['Accounting', 'Arts', 'Analytics', 'Capstone', 'IT', 'Social Psychology'];
        $scope.fileName = '///';
    	$scope.includeStatus = function(status) {
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

        $scope.categoryList = function(){
            $scope.categories = Categories.query();
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


        $scope.upload = function(file){
            var val;
            Upload.upload({
                url: '../upload',
                data: {file:file}
            }).then(function(resp){
                console.log(resp);

                if(resp.data.error_code === 0){
                    //vaidate success
                    //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $scope.fileName = resp.data.filename;
                    console.log(resp.data.filename);
                    
                    return resp.data.filename;
                }else{
                    //$window.alert('an error occured');
                    return "";
                }
            }, function (resp) { //catch error
                //console.log('Error status: ' + resp.status);
                //$window.alert('Error status: ' + resp.status);
                return resp.status;
            }, function (evt) { 
                //console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            })
            return "test";
        }
		
        $scope.uploadingFile = function(action) {
            
            var newProject = new Projects();
            
            var f = document.getElementById('uploadFile').files[0],
                r = new FileReader();
                if(f){
                    r.onloadend = function(e){
                    var data = e.target.result;
                    //send you binary data via $http or $resource or do anything else with it
                    }
                    r.readAsBinaryString(f);
                    var filename = "";
                   
                    if(action === 'add'){
                        //if($scope.projectAdd.file){
                            //console.log('found the file');
                            var name = $scope.upload($scope.projectAdd.file);
                                
                            $scope.$watch('fileName', function() {
                                //console.log($scope.fileName);
                                newProject.uploadFile = $scope.fileName;
                                if($scope.fileName !== '///'){
                                        $scope.add(newProject);
                                    
                                    $scope.fileName = '///';
                                }
                                
                            });    

                           // wait();  
                            //console.log(fileName);
                            var name;
                        //}
                    }else if(action === 'update'){
                        //if($scope.projectEdit.file){
                            //console.log(uploadFile);
                            //console.log('found the file');
                            var name = $scope.upload(f);
                                
                            $scope.$watch('fileName', function() {
                                //console.log($scope.fileName);
                                newProject.uploadFile = $scope.fileName;
                                if($scope.fileName !== '///'){
                                    
                                    $scope.update($scope.fileName);
                                    console.log($scope.fileName);
                                    $scope.fileName = '///';
                                }
                                
                            });    

                           // wait();  
                            //console.log(fileName);
                            var name;
                        //}
                    }
                    
                    

                    //console.log(f);
                    
                    //console.log(f);
                //if (nweProject.hp === undefined) {newProject.hp = null}
                newProject.uploadFile = f.name;
                
                }else{
                    if(action === 'add'){
                        $scope.add(newProject);
                    }else if(action === 'update'){
                        $scope.update('');
                    }
                    
                }
        };

    	$scope.update = function(filename) {
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

            $scope.project.uploadFile = filename;

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

        $scope.currentPage = 1,
        $scope.itemsPerPage = 5,
      	$scope.maxSize = 5;

        $scope.list = function() {
            $scope.categories = Categories.query();
        	$scope.open= true;
        	$scope.ongoing = false;
        	$scope.completed = false;
        	$scope.requested = false;
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

		$scope.add = function(proj) {
			var newProject = proj;
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

