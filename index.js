const express = require("express");
const cookieParser = require('cookie-parser');
let app = express();
let port = 8000;
const db = require("./config/mongoose");

//connecting static assets files 
app.use(express.static('assets'));


//used for session cookie
const session = require('express-session');

const passport = require('passport');

const passportLocal = require("./config/passport");
const passportGoogleOAuth = require("./config/google_auth");

//for storing session details
const mongoStore = require('connect-mongo')(session);

//for sending flash messages
const flash = require("connect-flash");

//set flash messgae to res.locals
const customMWare = require("./config/custom_middleware");

//mongo store is used to store the session cookie in db
app.use(session({
    name:'authorizeApp',
    secret:'key', // encryption/decryption Key
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*10)
    },
    store: new mongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect mongodb setup ok');
        }
    )}
));

app.use(express.urlencoded());

//using cookies and extractoing from requests
app.use(cookieParser());


//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(passport.initialize());
app.use(passport.session()); 
//here session stores cookie by itself
app.use(passport.setAuthenticatedUser); //so that user is stored in res.locals

app.use(flash());
app.use(customMWare.setFlash);

//use express router
app.use('/',require('./routes'));


//server listen on specified port number
app.listen(port,function(err){
    if(err){
        console.log(err);
    }
    console.log(`running on port ${port}`);
});

