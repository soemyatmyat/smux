//alert("client-controller");
angular.module('announcements').directive('fileModel',['$parse', function ($parse){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
                  console.log("in fileModel");
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);



angular.module('announcements',['ngFileUpload']).controller('AnnouncementController', ['$scope', 'Authentication', 'Upload', '$window', '$uibModal', '$routeParams', '$location', 'Announcements', 'Projects', '$timeout',
    function($scope, Authentication, Upload, $window, $uibModal, $routeParams, $location, Announcements, Projects, $timeout) {
        
        $scope.authentication = Authentication;
        $scope.statusIncludes = ['open'];
        $scope.categoryIncludes = ['Accounting', 'Arts', 'Capstone', 'IT', 'Social Psychology'];

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
            console.log(file);
            var fileName = file.name.split('.')[0];
            var extension = file.name.split('.')[1];
            console.log(fileName);
            console.log(Date.now());
            var newName = fileName + '_' + Date.now() + '.' + extension;
            console.log(newName);
            file.name = newName;
            console.log('after');
            console.log(file);
            Upload.upload({
                url: '../upload',
                data: {file:file},
                newName : newName
            }).then(function(resp){
                console.log(resp);

                if(resp.data.error_code === 0){
                    //vaidate success
                    //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
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
            return "";
        }

        $scope.add = function() {
            
            var newAnnouncement = new Announcements();
            newAnnouncement.title = this.title;
            //console.log(this.title);
            newAnnouncement.category = this.category;
            
            if($scope.start_date !== null){
                var yyyy = this.start_date.getFullYear().toString();
                var mm = (this.start_date.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = this.start_date.getDate().toString();
                newAnnouncement.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

            }
            if($scope.end_date !== null){
                yyyy = this.end_date.getFullYear().toString();
                mm = (this.end_date.getMonth()+1).toString(); // getMonth() is zero-based
                dd  = this.end_date.getDate().toString();
                newAnnouncement.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            
            }
            newAnnouncement.faculty_id = $scope.authentication.user._id;
            
            newAnnouncement.description = this.description;
            //console.log(this.term);
            newAnnouncement.course_id = this.course_id;

            /**var file = $scope.myFile;
               
            console.log('file is ' );
            console.dir(file);
               
            var uploadUrl = "public/upload";
            fileUpload.uploadFileToUrl(file, uploadUrl);**///
            
            var f = document.getElementById('uploadFile').files[0],
                r = new FileReader();
                r.onloadend = function(e){
                    var data = e.target.result;
                    //send you binary data via $http or $resource or do anything else with it
                }
                r.readAsBinaryString(f);
                var filename = "";
               
                if($scope.announcementAdd.file){
                    console.log('found the file');
                    $scope.upload($scope.announcementAdd.file);
                        
                    $scope.$watch('fileName', function() {
                        //alert('hey, myVar has changed!');
                        console.log($scope.fileName);
                        newAnnouncement.filename = $scope.fileName;
                    });    

                   // wait();  
                    //console.log(fileName);
                }
                var f = document.getElementById('uploadFile').files[0],
                r = new FileReader();
                r.onloadend = function(e){
                    var data = e.target.result;
                    //send you binary data via $http or $resource or do anything else with it
                }
                r.readAsBinaryString(f);

                //console.log(f);
                
                //console.log(f);
            //if (nweProject.hp === undefined) {newProject.hp = null}
            newAnnouncement.uploadFile = f.name;
            
            //console.log(newAnnouncement.uploadFile);
            newAnnouncement.$save(function(response) {
                console.log($scope.fileName);
                $location.path('announcements/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                
            });
        };

        function wait(){
            if(fileName === ''){
                $timeout(function(){},1000);
            }
        }

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


        $scope.update = function() {
            
            var yyyy = $scope.announcement.start_date.getFullYear().toString();
            var mm = ($scope.announcement.start_date.getMonth()+1).toString(); // getMonth() is zero-based
            var dd  = $scope.announcement.start_date.getDate().toString();
            $scope.announcement.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            yyyy = $scope.announcement.end_date.getFullYear().toString();
            mm = ($scope.announcement.end_date.getMonth()+1).toString(); // getMonth() is zero-based
            dd  = $scope.announcement.end_date.getDate().toString();
            $scope.announcement.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

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


