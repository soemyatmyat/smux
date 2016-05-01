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
exports.list = function(req, res) {
	var role = req.user.role;

	var id = req.user._id;
	//db.connect(function(err, results) {});	
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			if(role == 'Faculty'){
		//db.query("Select * from AnnouncementRequests", [], function(err, rows) {
		
				Connection.query("SELECT t2.*, Projects.title as projectTitle from(" +
				"SELECT t1._id as _id, org_id, announcement_id, title as announcementTitle, t1.requested_date as requested_date, t1.message as message, t1.project_id as project_id, name as organization FROM " + 
				"(SELECT AR._id as _id, org_id, announcement_id, title, AR.posted_date as requested_date, " +
				" AR.course_id, AR.project_id, message, AR.status" +
				" FROM AnnouncementRequests as AR LEFT OUTER JOIN Announcements " +
				" ON announcement_id = Announcements._id " +
				" WHERE Announcements.faculty_id = ? AND AR.status = ?) AS t1 " + 
				" LEFT OUTER JOIN Users ON t1.org_id = Users._id) as t2"+
				" LEFT OUTER JOIN Projects ON t2.project_id = Projects._id;", [id, 'requested'], function(err, rows) {
					Connection.release();
			
					/**db.query("SELECT AnnouncementRequests._id, org_id, announcement_id," + 
					" title, AnnouncementRequests.posted_date as requested_date, AnnouncementRequests.message" +
					" AnnouncementRequests.course_id, AnnouncementRequests.project_id, AnnouncementRequests.status " +
				" FROM AnnouncementRequests LEFT OUTER JOIN Announcements" + 
				" on announcement_id = Announcements._id" + 
				" WHERE Announcements.faculty_id = ?;",[id], function(err, rows){ **/
					if (err) {
						console.log(getErrorMessage(err));
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						for (var i = 0; i < rows.length; i++) {
							rows[i].requested_date = getDateFormat(rows[i].requested_date);
							//rows[i].posted_date = getDateFormat(rows[i].posted_date);
						}
						res.json(rows);
					}
				});

			}else if(role == 'Organization'){
				console.log("organization");
				Connection.query("SELECT t1._id as _id, org_id, announcement_id, title, t1.requested_date as requested_date, t1.message as message, t1.project_id as project_id, name as organization FROM" + 
				"(SELECT AR._id, org_id, announcement_id, title, AR.posted_date as requested_date," +
				" AR.course_id, AR.project_id, message, AR.status, category, Announcements.posted_date, start_date, end_date, description" +
				" FROM AnnouncementRequests as AR LEFT OUTER JOIN Announcements" +
				" ON announcement_id = Announcements._id " +
				" WHERE org_id = ? AND AR.status = ?) AS t1" + 
				" LEFT OUTER JOIN Users ON t1.org_id = Users._id;", [id, 'requested'], function(err, rows) {
					Connection.release();
		
					if (err) {
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						for (var i = 0; i < rows.length; i++) {
							rows[i].requested_date = getDateFormat(rows[i].requested_date);
						}
						res.json(rows);
					}
				})

			}
		}

	});

};

////////////////////
// read a request //
///////////////////
exports.read = function(req, res) {	
	var announcement_id = req.params.announcement_id;
	var org_id = req.query.org_id;

	//db.connect(function(err, results) {});
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("SELECT * FROM `AnnouncementRequests` WHERE `announcement_id` = ? and `org_id`", [announcement_id, org_id], function(err,rows){
			Connection.release();
			
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
		}
	});
	
};


///////////////////
// new request ///
/////////////////
exports.add = function(req, res, next) {	
	var today = new Date();
	var request = {
		org_id: req.user._id,
		project_id: req.body.project_id,
		announcement_id: req.body.announcement_id,
		message: req.body.description,
		posted_date: getDateFormat(today),
		status: 'requested'
	}
	
	//db.connect(function(err,results) {});
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("INSERT INTO `AnnouncementRequests` SET ? ", request, function(err,rows){
			//Connection.release();
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				Connection.query("SELECT _id FROM `AnnouncementRequests` WHERE `announcement_id` = ? and `org_id` = ?", [request.announcement_id, request.org_id], function(err,rows){
					Connection.release();
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
		}
	});
	next();
	
};


/////////////////////
// update request //
///////////////////
exports.update = function(req, res) {
	var announcement_id = req.body.announcement_id;
	var organization_id = req.body.org_id;
	var project_id = req.body.project_id;
	var req_id = req.body._id;
	//console.log(announcement_id);
	//console.log(organization_id);
	//console.log(project_id);
	var	project = {
		_id: req.body.project_id
	}
	var announcement = {
		_id: req.body.announcement_id
	}

	//db.connect(function(err, results) {});
	db.getConnection(function(err, Connection) {
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("UPDATE `AnnouncementRequests` SET `status` = ?, `org_id` = ? WHERE `_id` = ?", ["accepted", organization_id, req_id], function(err, rows) {
			//Connection.release();
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				Connection.query("DELETE FROM `AnnouncementRequests` WHERE `announcement_id` = ? AND '_id' != ?", [announcement_id,req_id], function(err, rows) {
					Connection.release();
					if (err) {
						console.log("error in deleting");
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						res.json(announcement);
					}
				})
			}
	})
		}
	});
	
};


var getDateFormat = function(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};	