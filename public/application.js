var appName = 'smux';
var app = angular.module(appName, ['dndLists', 'ui.bootstrap', 'ngResource', 'ngRoute', 'users', 'projects', 'requests', 'feedbacks', 'announcements','announcementrequests','categories']);

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