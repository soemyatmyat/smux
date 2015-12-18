process.env.NODE_ENV = process.env.NODE_ENV || 'development';


// load config, db, express, passport
var config = require('./config/config'),
	mysql = require('./config/mysql'),
    express = require('./config/express'),
    passport = require('./config/passport');
    
// create a new Express application obj
var app = express(),
	db = mysql(),
	passport = passport();
	

// listen on port specified in configuration file
app.listen(config.port);
// exports object is contained in each module and allow exposing pieces of 
// code when the module is loaded
// module object was orginally used to provide metadata information about 
// the module. it also contains the pointer to an exports object as a property
module.exports = app;
module.exports = db;

console.log(process.env.NODE_ENV + ' server running at http://localhost:'
 + config.port);
