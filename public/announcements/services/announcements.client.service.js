

angular.module('announcements').factory('Announcements', ['$resource',
	function($resource) {

		return $resource('api/announcements/:announcId', {
			announcId: '@_id'
		}, {
			update: {
				method: 'PUT',
				transformResponse: transformResponse
			},
			get: {
				transformResponse: transformResponse
			}
		});

		function transformResponse(data) {
			data = angular.fromJson(data);
			if (data.start_date != null) data.start_date = new Date(data.start_date);
			if (data.end_date != null) data.end_date = new Date(data.end_date);
			return data;
		}
	}
]);

angular.module('announcements').service('fileUpload', ['$http', function($http){
    this.uploadFileToUrl = function(file, uploadUrl){
        console.log(file);
        var fd = new FormData();
        fd.append('file', file);
        console.log(fd);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
    	
        .success(function(){
            console.log('success!');
        })
    
        .error(function(e){
        	console.log(e);
            console.log("error here");
        });

    }
}]);