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
	db.getConnection(function(err, Connection){
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("SELECT _id, description FROM `Category`", function(err, rows) {
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					for (var i =0; i <rows.length; i++) {
						rows[i].type = "category";
					}
					res.json(rows);
				}
			})
		}
	});
};



////////////////////////
// edit a category  ///
//////////////////////
exports.update = function(req, res) {
	console.log("--- update start here ---")
	console.log(req);
	res.json("sth");
};


///////////////////
// new category //
/////////////////
exports.add = function(req, res) {
	console.log("--- update start here ---")
	console.log(req);
	res.json("sth");
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




