let express = require('express');
const  router = express.Router();
module.exports = router;
const homeController = require("../controllers/home_controller");
const passport = require("passport");

//homepage
router.get("/",homeController.home);

//sign-up page
router.get("/sign-up",homeController.signUp);

//sign in page
router.get("/sign-in",homeController.signIn);

//request for signing in
router.post("/create-session",
    passport.authenticate('local',{failureRedirect:"/sign-in"}),
    homeController.createSession
);

//google authorization request
router.get("/google/auth",passport.authenticate('google',{scope:['profile','email']} ));

//google callback after the request and checking if request is authenticated or not
router.get(
    "/google/auth/callback",
    passport.authenticate('google',{failureRedirect:'/sign-in'}),
    homeController.googleCallback
);

//create a user after signup 
router.post("/create",homeController.create);

//update details of a user
router.post("/update/:id",homeController.updateProfile);

//signs out a user
router.get(
    "/sign-out",
    homeController.signOut
);
