var	mysql = require('../../config/mysql'),
	db = mysql();

////////////////////
// Error Message //
//////////////////
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};	


/////////////////////
// list requests ///
///////////////////
exports.list = function(req, res, next) {
	var role = req.user.role;

	var id = req.user._id;
	//db.connect(function(err, results) {});	

	if(role == 'faculty'){
		db.query("SELECT t1.*, name as organization FROM " + 
		"(SELECT AR._id, org_id, announcement_id, title, AR.posted_date as requested_date, " +
		" AR.course_id, AR.project_id, message, AR.status" +
		" FROM AnnouncementRequests as AR LEFT OUTER JOIN Announcements " +
		" ON announcement_id = Announcements._id " +
		" WHERE Announcements.faculty_id = ? AND AnnouncementRequests.status != ?) AS t1 " + 
		" LEFT OUTER JOIN Users ON t1.org_id = Users._id;", [id, 'accepted'], function(err, rows) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			for (var i = 0; i < rows.length; i++) {
				rows[i].requested_date = getDateFormat(rows[i].requested_date);
				rows[i].posted_date = getDateFormat(rows[i].posted_date);
			}
			res.json(rows);
		}
	})

	}else if(role == 'organization'){
		db.query("SELECT t1.*, name as organization FROM" + 
		"(SELECT AR._id, org_id, announcement_id, title, AR.posted_date as requested_date," +
		" AR.course_id, AR.project_id, message, AR.statuscategory, Announcements.posted_date, start_date, end_date, description" +
		" FROM AnnouncementRequests as AR LEFT OUTER JOIN Announcements" +
		" ON announcement_id = Announcements._id " +
		" WHERE org_id = ? AND AnnouncementRequests.status != ?) AS t1" + 
		" LEFT OUTER JOIN Users ON t1.org_id = Users._id;", [id, 'accepted'], function(err, rows) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			for (var i = 0; i < rows.length; i++) {
				rows[i].posted_date = getDateFormat(rows[i].posted_date);
			}
			res.json(rows);
		}
	})

	}

	

};

////////////////////
// read a request //
///////////////////
exports.read = function(req, res) {
	
	var announcement_id = req.params.announcement_id;
	var org_id = req.query.org_id;

	//db.connect(function(err, results) {});
	db.query("SELECT * FROM `AnnouncementRequests` WHERE `announcement_id` = ? and `org_id`", [announcement_id, org_id], function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			if (rows.length != 0) {
				rows[0].requested_date = getDateFormat(rows[0].requested_date);
			}
			res.json(rows[0]);
		}	
	})
};


///////////////////
// new request ///
/////////////////
exports.add = function(req, res) {	
	var today = new Date();
	var request = {
		org_id: req.user._id,
		project_id: req.body.project_id,
		announcement_id: req.body.announcement_id,
		message: req.body.description,
		posted_date: getDateFormat(today),
		status: 'submitted'
	}
	
	//db.connect(function(err,results) {});
	db.query("INSERT INTO `AnnouncementRequests` SET ? ", request, function(err,rows){
		if (err) {
			console.log("stuck in inserting");
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("SELECT _id FROM `AnnouncementRequests` WHERE `announcement_id` = ? and `org_id` = ?", [request.announcement_id, request.org_id], function(err,rows){
				if (err) {
					return res.status(400).send({
						message: "getErrorMessage(err)"
					});
				} else {
					request._id = rows[0]._id;
					res.json(request);
				}
				
			});
		}
	});
};


/////////////////////
// delete request //
///////////////////
exports.update = function(req, res) {
	var project_id = req.body.project_id;
	var faculty_id = req.body.faculty_id;
	var course_id = req.body.course_code;

	var	project = {
		_id: req.body.project_id
	}

	//db.connect(function(err, results) {});
	db.query("UPDATE `Projects` SET `status` = ?, `faculty_id` = ?, `course_id` = ? WHERE `_id` = ?", ["On-Going", faculty_id, course_id, project_id], function(err, rows) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("DELETE FROM `Requests` WHERE `project_id` = ?", [project_id], function(err, rows) {
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					res.json(project);
				}
			})
		}
	})
	/*
	var project_id = req.params.project_id;
	var faculty_id = req.params.faculty_id;
	//db.connect(function(err, results) {});	
	test = db.query("DELETE FROM `Requests` WHERE `project_id` = ? and `faculty_id`" + [id] + "';" , function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(req.params.projectId);
		}	
	});*/
};


var getDateFormat = function(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};	



