// load passport module and passport local authentication strategy for user authentication
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mysql = require('../mysql');


module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) { 

        var db = mysql();
        db.connect(function(err, results) {});
        db.query("SELECT * FROM `users` WHERE `email_address` = '" + username + "'", function(err,rows){
            console.log("here");

            if (err) return done(err);

            if (!rows.length) {
                //console.log("not found!");
                //return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                return done(null, false, {message: 'Unknown user'});
            };
            
            // if the user is found but the password is wrong 
            if (!(rows[0].password == password)) {
                console.log("wrong password");
                //return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                return done(null, false, {message: 'Invalid password'});
            };

            // all is well, return successful user
            return done(null, rows[0]);         
            
        });
        db.end();

    }));
};
