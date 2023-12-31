const User=require("../models/user.js");


module.exports.signUpForm=(req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.signUp=async(req,res,next)=>{
    try{
        let {username, email, password}=req.body;
        let newUser= new User({
            username,email
        });
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to AirBnb");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.logIn=async(req,res)=>{
    req.flash("success","Login Successful");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
}

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Loged-Out successfully");
        res.redirect("/listings");
    });
}