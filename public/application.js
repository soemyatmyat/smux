var appName = 'smux';
var app = angular.module(appName, ['ngResource', 'ngRoute', 'users']);

app.config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

angular.element(document).ready(function() {
	angular.bootstrap(document, [appName]);
});