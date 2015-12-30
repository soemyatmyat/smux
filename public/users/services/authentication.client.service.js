angular.module('users').factory('Authentication', [
	function() {
		this.user = window._user;
		return {
			user: this.user
		};
	}
]);