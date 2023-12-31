const express=require("express");
const router=express.Router();

const asyncWrap = require("../utilities/asyncWrap");

const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

const userController = require("../controllers/user.js");

//routes
router.route("/signup")
.get(userController.signUpForm)
.post(asyncWrap(userController.signUp))

router.route("/login")
.get(userController.loginForm)
.post( saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash: true,
    }),
    userController.logIn
)

router.get("/logout",userController.logOut);

module.exports=router;