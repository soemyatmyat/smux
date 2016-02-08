// load passport module and passport local authentication strategy for user authentication
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mysql = require('../mysql'),
    bcrypt = require('bcrypt');


module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) { 

        var db = mysql();
        //db.getConnection(function(err, results) {});
        db.query("SELECT * FROM `users` WHERE `email_address` = '" + username + "'", function(err,rows){

            if (err) return done(err);

            if (!rows.length) {
                return done(null, false, {message: 'Unknown user'});
            };
            
            // if the user is found but the password is wrong 
            bcrypt.compare(password, rows[0].password, function(err, res) {
                if (res === false) {
                    db.release();
                    return done(null, false, {message: 'Invalid password'});
                } else {
                    // all is well, return successful user
                    return done(null, rows[0]); 
                }
            });  

                    
            
        });
        //db.release();
    }));
};
