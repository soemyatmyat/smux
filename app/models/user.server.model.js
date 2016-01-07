var mysql = require('../../config/mysql'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
	db = mysql();

exports.delete = function(userId) {
	db.connect(function(err, results) {});	
	db.query("DELETE FROM `users` WHERE `_id` = '" + [id] + "';" , function(err,rows){
		if (err) {
			return err;
		} else {
			res.json(req.params.userId);
		}	
	});
}