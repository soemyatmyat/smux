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


/////////////////////////
// list announcements ///
////////////////////////
exports.list = function(req, res, next) {
	var role = req.user.role;

	db.getConnection(function(err, Connection) {
	if (err) {
		return res.status(400).send({ message: getErrorMessage(err) });
	} else {

		if (role == "Faculty") {
			Connection.query("SELECT temp._id as _id, temp.title as title, temp.category as category, temp.description as description, temp.posted_date as posted_date, temp.faculty_id, faculty_name, start_date, end_date, requests.project_id, temp.course_id, temp.status, uploadFile " + 
				" FROM (SELECT Announcements._id, title, category, description, posted_date, faculty_id, Users.name as faculty_name, start_date, end_date, project_id, course_id, status, uploadFile" + 
				" FROM `Announcements` LEFT OUTER JOIN Users" + 
				" ON faculty_id = Users._id AND faculty_id = ?) AS temp " + 
				" LEFT OUTER JOIN AnnouncementRequests as requests ON temp._id = requests.announcement_id", [req.user._id], function(err,rows){
				
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					for (var i =0; i <rows.length; i++) {
						rows[i].posted_date = getDateFormat(rows[i].posted_date);
					}
					res.json(rows);
				}
			})
		} else if(role == "Admin"){
			
			Connection.query("SELECT temp._id as _id, temp.title as title, temp.category as category, temp.description as description, temp.posted_date as posted_date, temp.faculty_id, faculty_name, start_date, end_date, requests.project_id, temp.course_id, temp.status, uploadFile " + 
				" FROM (SELECT Announcements._id, title, category, description, posted_date, faculty_id, Users.name as faculty_name, start_date, end_date, project_id, course_id, status, uploadFile" + 
				" FROM `Announcements` LEFT OUTER JOIN Users" + 
				" ON faculty_id = Users._id ) AS temp " + 
				" LEFT OUTER JOIN AnnouncementRequests as requests ON temp._id = requests.announcement_id", function(err,rows){
				Connection.release();
				
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {

					for (var i =0; i <rows.length; i++) {
						rows[i].posted_date = getDateFormat(rows[i].posted_date);
					}
					res.json(rows);
					
				}
			})
		}else {
			var org_id = req.user._id;
			Connection.query("SELECT temp._id as _id, temp.title as title, temp.category as category, temp.description as description, temp.posted_date as posted_date, temp.faculty_id, faculty_name, start_date, end_date, requests.project_id, temp.course_id, temp.status, uploadFile " + 
				" FROM (SELECT Announcements._id, title, category, description, posted_date, faculty_id, Users.name as faculty_name, start_date, end_date, project_id, course_id, status, uploadFile" + 
				" FROM `Announcements` LEFT OUTER JOIN Users" + 
				" ON faculty_id = Users._id ) AS temp " + 
				" LEFT OUTER JOIN AnnouncementRequests as requests ON temp._id = requests.announcement_id", function(err,rows){
				
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					for (var i =0; i <rows.length; i++) {
						rows[i].posted_date = getDateFormat(rows[i].posted_date);
						
						if(rows[i].project_id != null){
							rows[i].status = "requested";
							
						} 
					}
					res.json(rows);
				}
			})
		}
	}
		});
	
};


////////////////////
// read an announcement //
///////////////////
exports.read = function(req, res) {
	var id = req.params.announcId;

	db.getConnection(function(err, Connection) {
	//db.connect(function(err, results) {});
	if (err) {
		return res.status(400).send({ message: getErrorMessage(err) });
	} else {
		Connection.query("SELECT _id, title, category, description, posted_date, faculty_id, start_date, end_date, project_id, course_id, status FROM `Announcements` WHERE  _id = ?", [id], function(err,rows){
		if (err) {
			console.log(err);
			return res.status(400).send({
					message: getErrorMessage(err)
			});
		} else {
			Connection.query("SELECT * from `AnnouncementRequests` WHERE `announcement_id` =? and `org_id` = ?", [rows[0]._id, req.user._id], function(err, results) {
				Connection.release();
				if (err) {
					console.log(err);
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					if (results.length != 0) {
						rows[0].status = "requested";
					} 
				}
				rows[0].posted_date = new Date(rows[0].posted_date);
				rows[0].posted_date = getDateFormat(rows[0].posted_date);
				res.json(rows[0]);
			})

		}	
	});
	}
});
	//db.connect(function(err, results) {});

	/**db.query("SELECT temp._id, title, category, faculty_id, description, posted_date, project_id, start_date, end_date" + 
		"course_id, status, faculty_name from " + 
		"(SELECT Announcements._id, title, category, faculty_id, description, posted_date, start_date, end_date, project_id, " + 
		"course_id, status, users.name as faculty_name from `Announcements` left outer join `users` " + 
		"on Announcements.faculty_id = users._id where Announcements._id = ?) as temp left outer join users on temp.faculty_id = users._id;", [id], function(err,rows){		
	**/
	
};

////////////////////////
// update an announcement ///
//////////////////////
exports.update = function(req, res) {
	var id = req.body._id;
	
	if(req.body.uploadFile != ''){
		var	announcement = {
			title:req.body.title,
			category: req.body.category,
			project_id: req.body.project_id,
			start_date: req.body.start_date,
			end_date: req.body.end_date,
			description: req.body.description,
			course_id: req.body.course_id,
			uploadFile: req.body.uploadFile,
			status: "open"
		}
	}else{
		
		announcement = {
			title:req.body.title,
			category: req.body.category,
			project_id: req.body.project_id,
			start_date: req.body.start_date,
			end_date: req.body.end_date,
			description: req.body.description,
			course_id: req.body.course_id,
			status: "open"
		}
	}
	

	//db.connect(function(err,results) {});
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("UPDATE `Announcements` SET ? WHERE `_id` = ?", [announcement, id], function(err,rows){
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					announcement = {
						_id: id,
						title:req.body.title,
						category: req.body.category,
						project_id: req.body.project_id,
						start_date: req.body.start_date,
						end_date: req.body.end_date,
						description: req.body.description,
						course_id: req.body.course_id,
						status: "open"
					}
					res.json(announcement);
				}
			})

		}
	});
};


///////////////////////
// new announcement ///
//////////////////////
exports.add = function(req, res) {
	//console.log("add");
	var today = new Date();
	//console.log(req);
	//console.log(req.body.filename);
	//console.log(req.files);
	console.log(req.body.uploadFile);
	var announcement = {
		title:req.body.title,
		category: req.body.category,
		project_id: req.body.project_id,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		description: req.body.description,
		posted_date: getDateFormat(today),
		faculty_id: req.user._id,
		course_id: req.body.course_id,
		status: "open",
		uploadFile: req.body.uploadFile
	}
	//alert(announcement);
	//db.connect(function(err,results) {});
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("INSERT INTO `Announcements` SET ? ", announcement, function(err,rows){
			//Connection.release();
			if (err) {
				console.log(err);

				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				Connection.query("SELECT _id FROM `Announcements` WHERE `title` = ? and `faculty_id`", [announcement.title, announcement.faculty_id], function(err,rows){
					Connection.release();
					if (err) {
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						announcement._id = rows[0]._id;
						res.json(announcement);
					}
					
				});
			}
		});
		}
	});
	
};


/////////////////////
// delete announcement //
///////////////////
exports.delete = function(req, res) {
	console.log('delete');
	var id = req.params.announcId;

	//db.connect(function(err, results) {});	
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			test = Connection.query("DELETE FROM `Announcements` WHERE `_id` = '" + [id] + "';" , function(err,rows){
			Connection.release();
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				res.json(req.params.announcId);
			}	
		});
		}
	});
	
};


var getDateFormat = function(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};	




