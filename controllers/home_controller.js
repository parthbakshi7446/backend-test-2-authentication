const User = require("../models/user");
const bcrypt = require("bcrypt"); //password encryption

//creates a user
module.exports.create = function(req,res){
    if(req.body.conf_password!=req.body.password){
        req.flash('error',"password doesnt match");
        return res.redirect('back');
    }   
    req.body.password = bcrypt.hashSync(req.body.password,10);
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
}

//updaes a user profile
module.exports.updateProfile = function(req,res){
    User.findById(req.params.id,function(err,user){
        if(err){console.log("error finding user white updating");res.redirect('back');}
        if(user){
            user.name = req.body.name;
            user.email = req.body.email;
            if( bcrypt.compareSync(req.body.old_pass,user.password) ){
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
};

//sign in a user
module.exports.createSession = function(req,res){
    req.flash('success',"logged in successfully");
    return res.redirect('/');
}

module.exports.googleCallback = function(req,res){
    req.flash('success',"logged In Successfully using google");
    return res.redirect('/');
}

//sign out s user
module.exports.signOut = function(req,res){
    
    req.logout();
    if(req.isAuthenticated()){
        req.flash('success',"logged out successfully");
    }
    return res.redirect('/');
}

//render sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render("sign-in");
}

//render sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render("sign-up");
}
//renders home page
module.exports.home = function(req,res){
    return res.render("home");
}