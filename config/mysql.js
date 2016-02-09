// load config file and mysql 
var config = require('./config'),
    mysql = require('mysql');

// connect to database
module.exports = function() {
	/*
   var db = mysql.createConnection({
   	host: config.db_host,
   	user: config.db_user,
   	password: config.db_password,
   	database: config.db_database
   });
   return db;*/
	var db = mysql.createPool({
		host: config.db_host,
   		user: config.db_user,
   		password: config.db_password,
   		database: config.db_database,
   		connectionLimit: 100,
   		interactive_timeout: 15,
   		wait_timeout: 15
	});
	return db;
}
