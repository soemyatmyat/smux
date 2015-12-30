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
	
	db.connect(function(err, results) {});
	db.query("SELECT * FROM `requests`", function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			for (var i =0; i <rows.length; i++) {
				rows[i].requested_date = getDateFormat(rows[i].requested_date);
			}
			res.json(rows);
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
		requested_date: getDateFormat(today)
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
exports.delete = function(req, res) {
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



