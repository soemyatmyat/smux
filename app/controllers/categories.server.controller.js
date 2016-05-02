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
	db.getConnection(function(err, Connection){
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("SELECT _id, description, short_form FROM `Category` order by `order_id` ASC", function(err, rows) {
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
	var id = req.body._id;
	var category = {
		_id: req.body._id,
		description: req.body.description,
		short_form: req.body.description.replace(/\s+/g, "-"),
		order_id: req.body.order_id
	}
	db.getConnection(function(err, Connection){
		//db.connect(function(err,results) {});
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			if (id !== 0) {
				Connection.query("UPDATE `Category` SET ? WHERE `_id` = ?", [category, id], function(err,rows){
					Connection.release();
					if (err) {
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						category = {
							_id: id,
							description:req.body.description,
							order_id: req.body.order_id
						}
						res.json(category);
					}
				});
			} else {
				Connection.query("INSERT INTO `Category` SET ? ", [category], function(err,rows){
					Connection.release();
					if (err) {
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						category = {
							_id: id,
							description:req.body.description,
							order_id: req.body.order_id
						}
						res.json(category);
					}
				});
			}
		}
	});
};

//////////////////////
// delete category //
////////////////////
exports.delete = function(req, res) {

	
	var id = req.params.categoryId;
	db.getConnection(function(err, Connection){
	//db.connect(function(err, results) {});	
		if (err) {
			return res.status(400).send({ message: getErrorMessage(err) });
		} else {
			Connection.query("DELETE FROM `category` WHERE `_id` = '" + [id] + "';" , function(err,rows){
				Connection.release();
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					res.json(req.params.categoryId);
				}	
			});
		}
	});
};





