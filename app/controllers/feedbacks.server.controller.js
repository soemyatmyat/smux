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


////////////////////
// new feedback ///
//////////////////
exports.add = function(req, res) {

	var feedback = {
		project_id: req.body.project_id,
		user_id: req.user._id,
		feedback_text: req.body.feedback_text
	}

	db.connect(function(err, results) {});
	db.query("INSERT INTO Feedbacks SET ? ", feedback, function(err, rows) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("UPDATE `Projects` SET `status` = ? WHERE `_id` = ?", ["Completed", feedback.project_id], function(err, rows) {
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					res.json(feedback);
				}
			});
		}
	});
};



/////////////////////
// read feedback ///
///////////////////
exports.read = function(req, res) {
	//console.log(req);
	var logged_in_user = req.user_id;
	var project_id = req.params.project_id;
	var feedback = {
		project_id: project_id,
		faculty_feedback: {},
		org_feedback: {}
	}
	db.connect(function(err, results) {});
	db.query("SELECT * FROM `feedbacks` WHERE `project_id` = ?", [project_id], function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].user_id == req.user._id) {
					if (req.user.role == "Faculty") {
						feedback.faculty_feedback = rows[i].feedback_text;
					}
					if (req.user.role == "Organization") {
						feedback.org_feedback = rows[i].feedback_text;
					}
				}
			}
			res.json(feedback);
		}
	});
}
