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
// load node mailer
var nodemailer = require('nodemailer');
// load node multer
var multer = require('multer');

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
  var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, './upload/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var newName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, newName);
        //return newName;
    }
  });

  var upload = multer({ //multer settings
    storage: storage
  }).single('file');

  /** API path that will upload the files */
  app.post('/upload', function(req, res) {
      upload(req,res,function(err){
        //console.log(res.req);
        
        //console.log(res.req.file.filename);
        var fileName = res.req.file.filename;
          if(err){
               res.json({error_code:1,err_desc:err});
               //console.log(storage.filename);
               return 'abc';
          }
          //console.log(res.file.filename);
          
           res.json({error_code:0,filename:fileName, err_desc:null});
      })
     
  });
  // 

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
  // load the project by passing the app
  require('../app/routes/projects.server.routes.js')(app);
  // load the request by passing the app
  require('../app/routes/requests.server.routes.js')(app);
  // load the feedback by passing the app
  require('../app/routes/feedbacks.server.routes.js')(app);
  // load the announcement by passing the app
  require('../app/routes/announcements.server.routes.js')(app);
  // load the announcement request by passing the app
  require('../app/routes/announcementrequests.server.routes.js')(app);
  // load the categories by passing the app
  require('../app/routes/categories.server.routes.js')(app);
  return app;
}
