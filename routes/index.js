let express = require('express');
const  router = express.Router();
module.exports = router;
const homeController = require("../controllers/home_controller");

const passport = require("passport");

const User = require("../models/user");

router.get("/",function(req,res){
    return res.render("home");
});

router.get("/sign-up",function(req,res){
    return res.render("sign-up");
});

router.get("/sign-in",function(req,res){
    return res.render("sign-in");
});

router.post("/create-session",
    passport.authenticate('local',{failureRedirect:"/sign-in"}),
    function(req,res){
        req.flash('success',"logged in successfully");
        return res.redirect('/');
    }
);

router.get("/google/auth",passport.authenticate('google',{scope:['profile','email']} ));

router.get("/google/auth/callback",passport.authenticate('google',{failureRedirect:'/sign-in'}),function(req,res){

    req.flash('success',"logged In Successfully using google");
    return res.redirect('/');
});

router.post("/create",function(req,res){
    if(req.body.conf_password!=req.body.password){
        req.flash('error',"password doesnt match");
        return res.redirect('back');
    }   
    User.create(req.body,function(err,user){
        if(err){
            console.log("error creating user in db");
            console.log(err);
            req.flash('error',err);
            return res.redirect('back');
        }
        console.log(user);
        req.flash('success','Your Profile is Successfully Created');
        return res.redirect('/sign-in');
    });
});

router.post("/update/:id",function(req,res){
    User.findById(req.params.id,function(err,user){
        if(err){console.log("error finding user white updating");res.redirect('back');}
        if(user){
            user.name = req.body.name;
            user.email = req.body.email;
            if( user.password == req.body.old_pass){
                user.password = req.body.new_pass;
            }
            else if(req.body.old_password){
                req.flash('error',"Old Password wrong");
                return res.redirect('back');
            }
            user.save();
            req.flash('success',"Profile Updated");
            res.redirect('back');
        }
        else{
            req.flash('error',"cannot get your data");
            res.redirect('back');
        }
        
    });
});

router.get("/sign-out",function(req,res){
    req.logout();
    req.flash('success',"logged out successfully");
    return res.redirect('/');
});
