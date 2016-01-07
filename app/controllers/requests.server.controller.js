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
	var org_id = req.user._id;
	db.connect(function(err, results) {});
	db.query("SELECT _id FROM `Projects` WHERE `org_id` = ?", [org_id], function(err,projects){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			var querytxt = "SELECT * from `Requests` WHERE `project_id` in ("
			for (var i =0; i <projects.length; i++) {
				if (i == projects.length-1) {
					querytxt += projects[i]._id;
				} else {
					querytxt += projects[i]._id + ", ";
				}
			}
			querytxt += ")";
			db.query(querytxt, function(err, requests) {
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					var projectQuery = "SELECT title, _id from `Projects` WHERE `_id` in (";
					var facultyQuery = "SELECT _id, name, email_address from `Users` WHERE `_id` in ("
					for (var i = 0; i < requests.length; i++) {
						if (i == requests.length-1) {
							projectQuery += requests[i].project_id;
							facultyQuery += requests[i].faculty_id;
						} else {
							projectQuery += requests[i].project_id + ", ";
							facultyQuery += requests[i].faculty_id + ",";
						}
					}
					projectQuery += ")";
					facultyQuery += ")";
					db.query(projectQuery, function(err, results) {
						if (err) {
							return res.status(400).send({
								message: getErrorMessage(err)
							});
						} else {
							for (var i = 0; i < requests.length; i++) {
								for (var j = 0; j < results.length; j++) {
									if (requests[i].project_id == results[j]._id) {
										requests[i].project_name = results[j].title;
									}
								}
							}
							db.query(facultyQuery, function(err, rows) {
								if (err) {
									return res.status(400).send({
										message: getErrorMessage(err)
									});
								} else {
									for (var i = 0; i < requests.length; i++) {
										for (var j = 0; j < rows.length; j++) {
											if (requests[i].faculty_id == rows[j]._id) {
												requests[i].faculty_name = rows[j].name;
												requests[i].faculty_email = rows[j].email_address;
											}
										}
										requests[i].requested_date = getDateFormat(requests[i].requested_date);
									}
									console.log(requests);
									res.json(requests);
								}
							})
						}
					})
				}
			})
		}
	})
};


////////////////////
// read a request //
///////////////////
exports.read = function(req, res) {
	
	var project_id = req.params.project_id;
	var faculty_id = req.query.faculty_id;

	db.connect(function(err, results) {});
	db.query("SELECT * FROM `requests` WHERE `project_id` = ? and `faculty_id`", [project_id, faculty_id], function(err,rows){
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
		course_code: req.body.course_code,
		project_id: req.body.project_id,
		faculty_id: req.user._id,
		message: req.body.message,
		requested_date: getDateFormat(today),
		status: 'submitted'
	}
	
	db.connect(function(err,results) {});
	db.query("INSERT INTO `Requests` SET ? ", request, function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("SELECT _id FROM `Requests` WHERE `project_id` = ? and `faculty_id`", [request.project_id, request.faculty_id], function(err,rows){
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
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

	db.connect(function(err, results) {});
	db.query("UPDATE `Projects` SET `status` = ?, `faculty_id` = ?, `course_id` = ? WHERE `_id` = ?", ["On-Going", faculty_id, course_id, project_id], function(err, rows) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("DELETE FROM `Requests` WHERE `project_id` = ?", [project_id], function(err, rows) {
				if (err) {
					console.log(err);
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
	db.connect(function(err, results) {});	
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



