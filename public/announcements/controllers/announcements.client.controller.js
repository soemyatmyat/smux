angular.module('announcements',['ngFileUpload']).controller('AnnouncementController', ['$scope', 'Authentication', 'Upload', '$window', '$uibModal', '$routeParams', '$location', 'Announcements', 'Projects', '$timeout', 'Categories',
    function($scope, Authentication, Upload, $window, $uibModal, $routeParams, $location, Announcements, Projects, $timeout, Categories) {
        
        $scope.authentication = Authentication;
        $scope.statusIncludes = ['open'];
        $scope.categoryIncludes = ['Accounting', 'Analytics', 'Arts', 'Capstone', 'IT', 'Social Psychology'];
        $scope.filters ={};
        $scope.fileName = '///';
        $scope.selectedCategory = '';
        //console.log(Projects);
        //console.log($scope.Projects);
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

        $scope.statusFilter = function(announcement) {  
            if ($scope.statusIncludes.length > 0) {
                if ($.inArray(announcement.status, $scope.statusIncludes) < 0) {
                    return;
                } else {
                    return announcement;
                }
            } else {
                return;
            }
        }



        $scope.categoryList = function(){
            $scope.categories = Categories.query();

        }
        

        $scope.includeCategory = function(category) {
            if ($scope[category.short_form] === undefined) {
                $scope[category.short_form] = true;
                //console.log("if");
            } else {
                //console.log('else');
                $scope[category.short_form] = !$scope[category.short_form];
            }
            console.log($scope.categoryIncludes);
            var i = $.inArray(category.description, $scope.categoryIncludes);
            if (i > -1) {
                console.log( ' i > -1');
                $scope.categoryIncludes.splice(i, 1);
            } else {
                console.log('i !> -1')
                $scope.categoryIncludes.push(category.description);
            }
        }

        $scope.categoryFilter = function(announcement) {
            if ($scope.categories.length > 0) {
                if ($.inArray(announcement.category, $scope.categoryIncludes) < 0) {
                    return;
                } else {
                    return announcement;
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
                    announcement: function() {
                        return $scope.announcement;
                    }
                }
            });
        };

        $scope.toggleBtn = function(category,id){
            $("." +category + id).text(function(i, text){
              return text === "View More" ? "View Less" : "View More";
          });
        };
        
       
        $scope.upload = function(file){
            var val;
            Upload.upload({
                url: '../upload',
                data: {file:file}
            }).then(function(resp){
                //console.log(resp);

                if(resp.data.error_code === 0){
                    //vaidate success
                    //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $scope.fileName = resp.data.filename;
                    //console.log(resp.data.filename);
                    
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
            
            var newAnnouncement = new Announcements();
            
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

                        //if($scope.announcementAdd.file){
                            console.log('found the file');
                            var name = $scope.upload($scope.announcementAdd.file);
                                
                            $scope.$watch('fileName', function() {
                            	
                                newAnnouncement.uploadFile = $scope.fileName;
                                
                                if($scope.fileName !== '///'){
                                	
                                        $scope.add(newAnnouncement);
                                    	
                                    $scope.fileName = '///';
                                }
                                
                            });    

                           // wait();  
                            //console.log(fileName);
                            var name;
                        //}
                    }else if(action === 'update'){
                        console.log($scope.announcementEdit)
                            
                            var name = $scope.upload(f);
                                
                            $scope.$watch('fileName', function() {
                                newAnnouncement.uploadFile = $scope.fileName;
                                if($scope.fileName !== '///'){
                                    
                                        $scope.update($scope.fileName);
                 
                                    $scope.fileName = '///';
                                }
                                
                            });    

                  
                            var name;
             
                    }
                    newAnnouncement.uploadFile = f.name;
                }else{
                    if(action === 'add'){
                    	
                        $scope.add(newAnnouncement);
                    }else if(action === 'update'){
                        $scope.update('');
                    }
                    
                }
                
            
           
        };

        $scope.add = function(announc) {
            //console.log("in add");
            var newAnnouncement = announc;
            newAnnouncement.title = this.title;
            //console.log(this.title);
            newAnnouncement.category = this.category;
            
            if(this.start_date !== null){
                var yyyy = this.start_date.getFullYear().toString();
                var mm = (this.start_date.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = this.start_date.getDate().toString();
                newAnnouncement.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

            }
            if(this.end_date !== null){
                yyyy = this.end_date.getFullYear().toString();
                mm = (this.end_date.getMonth()+1).toString(); // getMonth() is zero-based
                dd  = this.end_date.getDate().toString();
                newAnnouncement.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            
            }
            newAnnouncement.faculty_id = $scope.authentication.user._id;
            
            newAnnouncement.description = this.description;
          
            newAnnouncement.course_id = this.course_id;
            
           
            newAnnouncement.$save(function(response) {
                console.log($scope.fileName);
                $location.path('announcements/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                
            });
        };


        $scope.read = function() {
            //alert($routeParams.announcId);
            $scope.announcement = Announcements.get({
                announcId: $routeParams.announcId
            });
        };



        $scope.list = function() {
            $scope.open= true;
            $scope.ongoing = false;
            $scope.completed = false;
            $scope.requested = false;
            $scope.categories = Categories.query();
            $scope.announcements = Announcements.query();
        };

        $scope.projectList = function(){
            $scope.projects = Projects.query();
            //console.log($scope.projects);
        }


        $scope.update = function(filename) {
            console.log('in update');
            console.log(filename);
            console.log(this.start_date);
            if(this.start_date != null){
                var yyyy = this.start_date.getFullYear().toString();
                var mm = (this.start_date.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = this.start_date.getDate().toString();
                $scope.announcement.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

            }
            if(this.end_date != null){
                yyyy = this.end_date.getFullYear().toString();
                mm = (this.end_date.getMonth()+1).toString(); // getMonth() is zero-based
                dd  = this.end_date.getDate().toString();
                $scope.announcement.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            
            }

            $scope.announcement.uploadFile = filename;
            $scope.announcement.$update(function(response) {
                $window.alert('Updated Successfully!');
                //$location.path('projects/' + $scope.project._id);
                $location.path('announcements/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.delete = function(announcement) {
            	var deleteProject = $window.confirm('Are you sure you want to withdrawal the Announcement?');
                if(deleteProject){
                    announcement.$remove(function(response) {
                        $location.path('announcements/')
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
                
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

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

    }

]);


