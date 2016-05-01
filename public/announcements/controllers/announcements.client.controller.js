angular.module('announcements',['ngFileUpload']).controller('AnnouncementController', ['$scope', 'Authentication', 'Upload', '$window', '$uibModal', '$routeParams', '$location', 'Announcements', 'Projects', '$timeout', 'Categories',
    function($scope, Authentication, Upload, $window, $uibModal, $routeParams, $location, Announcements, Projects, $timeout, Categories) {
        
        $scope.authentication = Authentication;
        $scope.statusIncludes = ['open'];
        $scope.categoryIncludes = ['Accounting', 'Arts', 'Capstone', 'IT', 'Social Psychology'];

        $scope.fileName = '///';
        //console.log(Projects);
        //console.log($scope.Projects);
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

        $scope.includeCategory = function(category) {
            //alert(category);
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

        $scope.categoryFilter = function(announcement) {
            if ($scope.categoryIncludes.length > 0) {
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
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $scope.fileName = resp.data.filename;
                    console.log(resp.data.filename);
                    
                    return resp.data.filename;
                }else{
                    $window.alert('an error occured');
                    return "";
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
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

                        if($scope.announcementAdd.file){
                            console.log('found the file');
                            var name = $scope.upload($scope.announcementAdd.file);
                                
                            $scope.$watch('fileName', function() {
                            	console.log('line 137');
                                console.log($scope.fileName);
                                newAnnouncement.uploadFile = $scope.fileName;
                                console.log($scope.fileName);
                                if($scope.fileName !== '///'){
                                	console.log("going to call add method");
                                        $scope.add(newAnnouncement);
                                    	
                                    $scope.fileName = '///';
                                }
                                
                            });    

                           // wait();  
                            //console.log(fileName);
                            var name;
                        }
                    }else if(action === 'update'){
                        if($scope.announcementEdit.file){
                            console.log(uploadFile);
                            console.log('found the file');
                            var name = $scope.upload($scope.announcementEdit.file);
                                
                            $scope.$watch('fileName', function() {
                                //console.log($scope.fileName);
                                newAnnouncement.uploadFile = $scope.fileName;
                                if($scope.fileName !== '///'){
                                    
                                        $scope.update($scope.fileName);
                                    console.log($scope.fileName);
                                    $scope.fileName = '///';
                                }
                                
                            });    

                           // wait();  
                            //console.log(fileName);
                            var name;
                        }
                    }
                    
                    

                    //console.log(f);
                    
                    //console.log(f);
                //if (nweProject.hp === undefined) {newProject.hp = null}
                newAnnouncement.uploadFile = f.name;
                console.log(f.name);
                }else{
                    if(action === 'add'){
                    	console.log("going to call purely from add")
                        $scope.add(newAnnouncement);
                    }else if(action === 'update'){
                        $scope.update('');
                    }
                    
                }
                
            
           
        };

        $scope.add = function(announc) {
            console.log("in add");
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
            //console.log(this.term);
            newAnnouncement.course_id = this.course_id;
            console.log(newAnnouncement)
            /**var file = $scope.myFile;
               
            console.log('file is ' );
            console.dir(file);
               
            var uploadUrl = "public/upload";
            fileUpload.uploadFileToUrl(file, uploadUrl);**///
            /**
            var f = document.getElementById('uploadFile').files[0],
                r = new FileReader();
                if(f){
                    r.onloadend = function(e){
                    var data = e.target.result;
                    //send you binary data via $http or $resource or do anything else with it
                    }
                    r.readAsBinaryString(f);
                    var filename = "";
                   
                    if($scope.announcementAdd.file){
                        //console.log('found the file');
                        $scope.upload($scope.announcementAdd.file).then(function(result){
                            console.log("it is successful");
                        });
                            
                        $scope.$watch('fileName', function() {
                            //alert('hey, myVar has changed!');
                            console.log($scope.fileName);
                            newAnnouncement.filename = $scope.fileName;
                        });    

                       // wait();  
                        //console.log(fileName);
                    }
                    

                    //console.log(f);
                    
                    //console.log(f);
                //if (nweProject.hp === undefined) {newProject.hp = null}
                newAnnouncement.uploadFile = f.name;
                }
                **/
            
            //console.log(newAnnouncement.uploadFile);
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
            $scope.accounting = true;
            $scope.arts = true;
            $scope.capstone = true;
            $scope.it = true;
            $scope.social = true;
            $scope.announcements = Announcements.query();
        };

        $scope.projectList = function(){
            $scope.projects = Projects.query();
            //console.log($scope.projects);
        }


        $scope.update = function(filename) {
            console.log('in update');
            console.log(filename);
            if($scope.start_date !== null){
                var yyyy = this.start_date.getFullYear().toString();
                var mm = (this.start_date.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = this.start_date.getDate().toString();
                $scope.announcement.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

            }
            if($scope.end_date !== null){
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
            	
                announcement.$remove(function(response) {
                    $location.path('announcements/')
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
        };

        $scope.categoryList = function() {
            $scope.categories = Categories.query();
        }

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


