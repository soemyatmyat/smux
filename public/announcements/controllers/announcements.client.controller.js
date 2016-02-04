//alert("client-controller");
angular.module('announcements').controller('AnnouncementController', ['$scope', 'Authentication', '$window', '$uibModal', '$routeParams', '$location', 'Announcements',
    function($scope, Authentication, $window, $uibModal, $routeParams, $location, Announcements) {
        
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
        

        $scope.add = function() {
            
            var newAnnouncement = new Announcements();
            newAnnouncement.title = this.title;
            //console.log(this.title);
            newAnnouncement.category = this.category;
            if(typeof this.start_date !== 'undefined'){
                var yyyy = this.start_date.getFullYear().toString();
                var mm = (this.start_date.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = this.start_date.getDate().toString();
                newAnnouncement.start_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

            }
            if(typeof this.end_date !== 'undefined'){
                yyyy = this.end_date.getFullYear().toString();
                mm = (this.end_date.getMonth()+1).toString(); // getMonth() is zero-based
                dd  = this.end_date.getDate().toString();
                newAnnouncement.end_date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
            
            }
            newAnnouncement.faculty_id = $scope.authentication.user._id;
            
            newAnnouncement.description = this.description;
            //console.log(this.term);
            newAnnouncement.course_id = this.course_id;


            //if (nweProject.hp === undefined) {newProject.hp = null}
            
            newAnnouncement.$save(function(response) {
                
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
            	alert(announcement);
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


