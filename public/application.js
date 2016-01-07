var appName = 'smux';
var app = angular.module(appName, [ 'ui.bootstrap', 'ngResource', 'ngRoute', 'users', 'projects', 'requests', 'feedbacks']);

app.config(['$locationProvider', function($locationProvider) {
        //if (window.history && window.history.pushState) {
        //	$locationProvider.html5Mode(true);	
        //}
        $locationProvider.hashPrefix('!');
    }
]);


angular.element(document).ready(function() {
	angular.bootstrap(document, [appName]);
});