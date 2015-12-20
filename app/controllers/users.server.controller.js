
var mysql = require('../../config/mysql'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
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

/////////////////
// login form //
///////////////
exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

//////////////
// log out //
////////////
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/////////////////
// list users //
///////////////
exports.list = function(req, res, next) {
	if (req.user) {
		db.connect(function(err, results) {});
		db.query("SELECT _id, name, email_address, role FROM `users`", function(err,rows){
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				res.json(rows);
			}
		})
	} else {
		return res.redirect('/');
	}
};


//////////////////
// read a user //
////////////////
exports.read = function(req, res) {
	var id = req.params.userId;
	db.connect(function(err, results) {});
	var test = db.query("SELECT _id, name, email_address, role FROM `users` WHERE `_id` = ?", [id], function(err,rows){
		if (err) {

		} else {
			res.json(rows[0]);
		}	
	});
};

////////////////////
// update a user //
//////////////////
exports.update = function(req, res) {
	var id = req.body._id;
	var data = {
		name:req.body.name,
		email_address: req.body.email_address,
		role: req.body.role
	}
	db.connect(function(err,results) {});
	test = db.query("UPDATE `users` SET ? WHERE `_id` = ?", [data, id], function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			data = {
				_id: id,
				name:req.body.name,
				email_address: req.body.email_address,
				role: req.body.role
			}
			res.json(data);
		}
	});

};


////////////////////
// regiser a user /
//////////////////
exports.register = function(req, res) {
	if (req.user) {
		res.render('users_add')
	} else {
		return res.redirect("/");
	}
};

////////////////
// new  user //
//////////////
exports.add = function(req, res) {
	var pwd = req.body.password;
	pwd = bcrypt.hashSync(pwd, SALT_WORK_FACTOR);
	var data = {
		name:req.body.name,
		email_address: req.body.email_address,
		password: pwd,
		role: req.body.role
	}
	db.connect(function(err,results) {});
	db.query("INSERT INTO `users` SET ? ", data, function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			db.query("SELECT _id FROM `users` WHERE `email_address` = ?", [data.email_address], function(err,rows){
				if (err) {
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {
					data._id = rows[0]._id;
					res.json(data);
				}
				
			});
		}
	});
};


//////////////////
// delete  user //
/////////////////
exports.delete = function(req, res) {
	var id = req.params.userId;
	db.connect(function(err, results) {});	
	test = db.query("DELETE FROM `users` WHERE `_id` = '" + [id] + "';" , function(err,rows){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(req.params.userId);
		}	
	});
};


////////////////////////////
// Check Authentication  //
//////////////////////////
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
		/*return res.status(401).send({
			message: 'User is not logged in'
		});*/
	}
	next();
};


