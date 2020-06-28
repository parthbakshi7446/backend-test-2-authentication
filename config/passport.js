const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true //req in the below callback is passed using this 
    },
    function(req,email,password,done){
        //find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err);
                return done(err);
            }
            //user not found or password doesnt match
            if(!user || user.password!=password){
                req.flash('error','Invalid Username/password');
                return done(null, false);
            }
            //user found
            return done(null,user);
        });
    }
));

//serializing the user to decide which key is to kept in cookies
passport.serializeUser(function(user,done){
    return done(null,user._id);
});

//deserializing means in session cookie ,user id is stored and from that id , we need to store user back to
//req.user from that id
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("err in finding user in db,passport");
            return done(err);
        }
        return done(null,user);
    });
});

passport.checkAuthentication = function(req,res,next){
    //if user is signed in, pass request to next action of controller
    if(req.isAuthenticated()){
        return next();
    }
    console.log('oops not authorised');
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from session cookie adn here sending it to locals
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;