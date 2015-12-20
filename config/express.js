// load config file
var config = require('./config');
// load body Parser 
var bodyParser = require('body-parser');
// load express module
var express = require('express');
// load passport module
var passport = require('passport');
// load express session to store user session
var session = require('express-session');
// load flash module
var flash = require('connect-flash');

// CommonJS module - initialize the Express application
module.exports = function() {

  // create express obj
  var app = express();

  // use body parser to handle request
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  // use session 
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'anything'
  }));

  // use passport with session (above)
  app.use(passport.initialize());
  app.use(passport.session());

  // use flash
  app.use(flash());

  // template location
  app.set('views', './app/views');
  // Node.js's templating engine EJS
  app.set('view engine', 'ejs');
  // locate the static folder
  app.use(express.static('./public'));

  // load routing file and call it as a function while passing the app
  require('../app/routes/index.server.routes.js')(app);
  // load the user by passing the app
  require('../app/routes/users.server.routes.js')(app);

  

  return app;
}
