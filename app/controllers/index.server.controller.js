
exports.render = function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	} else {
		res.render('index', {
			title: 'SMUX',
			user: JSON.stringify(req.user)
		});
	}
}