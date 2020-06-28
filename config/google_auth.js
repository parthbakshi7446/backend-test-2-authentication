const passport = require('passport');
const GOOGLE_CLIENT_ID = require("../credential").id;
const GOOGLE_CLIENT_SECRET = require("../credential").secret;
const GoogleOAuthStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require("crypto");

const User = require('../models/user');

//authentication using passport
passport.use(new GoogleOAuthStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/google/auth/callback" //req in the below callback is passed using this 
    },
    function(accessToken, refreshToken, profile, done) {
        // console.log(accessToken);
        // console.log(profile);
        User.findOne({
            email:profile.emails[0].value
        },function(err,user){
            if(err) {console.log(err);return done(err);}
            if(user){
                return done(null,user);
            }
            else{
                User.create({ 
                    email: profile.emails[0].value,
                    name:profile.displayName,
                    password: crypto.randomBytes(20).toString('hex')
                 }, 
                 function (err, user) {
                    if(err) {console.log(err);return done(err);}
                    return done(null, user);
                });
            }
        });
        
      }
));


module.exports = passport;