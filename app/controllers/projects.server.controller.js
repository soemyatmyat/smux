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
// list projects ///
///////////////////
exports.list = function(req, res, next) {
	db.connect(function(err, results) {});
	db.query("SELECT _id, title, category, description, posted_date, org_id FROM `projects`", function(err,rows){
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
};


////////////////////
// read a project //
///////////////////
exports.read = function(req, res) {
	var id = req.params.projectId;
		console.log("read: " + id );

	db.connect(function(err, results) {});
	var test = db.query("SELECT * FROM `projects` WHERE `_id` = ?", [id], function(err,rows){
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			rows[0].start_date = getDateFormat(rows[0].start_date);
			rows[0].end_date = getDateFormat(rows[0].end_date);
			rows[0].posted_date = getDateFormat(rows[0].posted_date);
			console.log(rows[0]);
			res.json(rows[0]);
		}	
	});
};

////////////////////////
// update a project ///
//////////////////////
exports.update = function(req, res) {
	var id = req.body._id,
		project = {
		title:req.body.title,
		category: req.body.category,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		contact_person: req.body.contact_person,
		contact_email: req.body.contact_email,
		contact_HP: req.body.contact_HP,
		description: req.body.description,
	}
	db.connect(function(err,results) {});
	test = db.query("UPDATE `projects` SET ? WHERE `_id` = ?", [project, id], function(err,rows){
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			project = {
				_id: id
			}
			res.json(project);
		}
	});
};


///////////////////
// new project ///
/////////////////
exports.add = function(req, res) {
	var today = new Date();
	var project = {
		title:req.body.title,
		category: req.body.category,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		contact_person: req.body.contact_person,
		contact_email: req.body.contact_email,
		contact_HP: req.body.contact_HP,
		description: req.body.description,
		posted_date: getDateFormat(today),
		org_id: req.user._id,
		faculty_id: null,
		course_id: null,
		status: "open"
	}
	db.connect(function(err,results) {});
	db.query("INSERT INTO `projects` SET ? ", project, function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("SELECT _id FROM `projects` WHERE `title` = ? and `org_id`", [project.title, project.org_id], function(err,rows){
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					project._id = rows[0]._id;
					res.json(project);
				}
				
			});
		}
	});
};


/////////////////////
// delete project //
///////////////////
exports.delete = function(req, res) {
	var id = req.params.projectId;
	db.connect(function(err, results) {});	
	test = db.query("DELETE FROM `projects` WHERE `_id` = '" + [id] + "';" , function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(req.params.projectId);
		}	
	});
};

var getDateFormat = function(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};	




