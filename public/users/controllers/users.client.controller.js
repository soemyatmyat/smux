//alert("client-controller");
angular.module('users').controller('UsersController', ['$scope', 'Authentication', '$window', '$routeParams', '$location', 'Users',
    function($scope, Authentication, $window, $routeParams, $location, Users) {
        //alert("client-controller2");
        
        /*
        $scope.role = function() {
            $scope.user.role = "Admin";
        };
        $scope.role();*/

        $scope.authentication = Authentication;

        $scope.list = function() {
            $scope.users = Users.query();
        };

        $scope.read = function() {
            $scope.user = Users.get({
                userId: $routeParams.userId
            });
        };

        $scope.update = function() {
            $scope.user.$update(function() {
                $window.alert('Updated Successfully!');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        
        $scope.add = function() {
            var newUser = new Users();
            newUser.name = this.user;
            newUser.email_address = this.email_address;
            newUser.password = this.password;
            newUser.role = this.role;
    
            newUser.$save(function(response) {
                $location.path('users/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        $scope.delete = function(user) {
            var deleteUser = $window.confirm('Are you sure you want to delete?');
            if (deleteUser) {
                user.$remove(function() {
                    for (var i in $scope.users) {
                        if ($scope.users[i] === user) {
                            $scope.users.splice(i, 1);
                        }
                    }
                });
            } 
        };
    }
]);
