
var mysql = require('../../config/mysql'),
	db = mysql();

/////////////////
// login form //
///////////////
exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Log-in Form'
            //messages: req.flash('error') || req.flash('info')
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
		db.query("SELECT name, email_address, role FROM `users`", function(err,rows){
			if (err) {
				return next(err);
			} else {
				res.render('users', {
					title: 'SMUX Users',
					users: rows
				});
			}
		})
		//db.end();
	} else {
		return res.redirect('/');
	}
};


//////////////////
// read a user //
////////////////
exports.read = function(req, res) {
	var username = req.params.username + "@gmail.com";
	if (req.user) {
		db.connect(function(err, results) {});
		db.query("SELECT name, email_address, role FROM `users` WHERE `email_address` = ?", [username], function(err,rows){
			if (err) {

			} else {
				res.render('users_edit', {
					user: rows
				});
			}	
		});
	} else {
		return res.redirect('/');
	}
};

////////////////////
// update a user //
//////////////////
exports.update = function(req, res) {
	if (req.user) {
		var email = req.body.email;
		var data = {
			name:req.body.username,
			role: req.body.role
		}
		db.connect(function(err,results) {});
		db.query("UPDATE `users` SET ? WHERE `email_address` = ?", [data, email], function(err,rows){
			if (err) {

			} else {
				return res.redirect("/" + email.substring(0,email.indexOf('@')) + "");
			}
		});
	} else {
		return res.redirect("/");
	}
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

	if (req.user) {
		var data = {
			name:req.body.username,
			email_address: req.body.email,
			password: req.body.password,
			role: req.body.role
		}
		db.connect(function(err,results) {});
		var query = db.query("INSERT INTO `users` SET ? ", data, function(err,rows){
			if (err) {
			} else {
				return res.redirect("/" + data.email_address.substring(0,data.email_address.indexOf('@')) + "");
			}
		});

	} else {
		return res.redirect("/");
	}
};


//////////////////
// delete  user //
/////////////////
exports.delete = function(req, res) {
	var username = req.params.username;
	if (req.user) {
		db.connect(function(err, results) {});	
		db.query("DELETE FROM `users` WHERE `email_address` = ?" + [username] , function(err,rows){
			if (err) {

			} else {
				return res.redirect('/users');
			}	
		});
	} else {

	}
}


