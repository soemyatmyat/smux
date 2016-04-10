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
// list categories ///
///////////////////
exports.list = function(req, res) {
	var role = req.user.role;
	console.log("here in list");
};



////////////////////////
// edit a category  ///
//////////////////////
exports.update = function(req, res) {
	var id = req.body._id;
	var	project = {
		title:req.body.title,
		category: req.body.category,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		contact_person: req.body.contact_person,
		contact_email: req.body.contact_email,
		contact_HP: req.body.contact_HP,
		description: req.body.description,
		status: "open"
	}
	if (project.start_date != null) {
		project.start_date = new Date(project.start_date);
	}
	if (project.end_date != null) {
		project.end_date = new Date(project.end_date);
	}
	db.getConnection(function(err, Connection){
		//db.connect(function(err,results) {});
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("UPDATE `projects` SET ? WHERE `_id` = ?", [project, id], function(err,rows){
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					project = {
						_id: id,
						title:req.body.title,
						category: req.body.category,
						start_date: req.body.start_date,
						end_date: req.body.end_date,
						contact_person: req.body.contact_person,
						contact_email: req.body.contact_email,
						contact_HP: req.body.contact_HP,
						description: req.body.description,
						status: "open"
					}
					res.json(project);
				}
			});
		}
	});
};


///////////////////
// new category //
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
	db.getConnection(function(err, Connection) {
		//db.connect(function(err,results) {});
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("INSERT INTO `projects` SET ? ", project, function(err,rows){
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					Connection.query("SELECT _id FROM `projects` WHERE `title` = ? and `org_id`", [project.title, project.org_id], function(err,rows){
						Connection.release();
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
		}
	});
};


//////////////////////
// delete category //
////////////////////
exports.delete = function(req, res) {
	var id = req.params.projectId;
	db.getConnection(function(err, Connection){
	//db.connect(function(err, results) {});	
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("DELETE FROM `projects` WHERE `_id` = '" + [id] + "';" , function(err,rows){
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					res.json(req.params.projectId);
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




