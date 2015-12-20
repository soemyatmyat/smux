
exports.render = function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	} else {
		res.render('index');
			//, {
			//title: 'Hi World'
		//});
	}
}