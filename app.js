if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;

//------
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));

//for delete and put request "method-override"
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//listing routes
const listingsRouter=require("./routes/listing.js");
//review routes
const reviewsRouter=require("./routes/review.js")
//User routes
const userRouter=require("./routes/user.js");

//mongoose setup    
const dbUrl=process.env.ATLASDB_URL;
const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

//error handling for async mongoose error and custom errors 
const asyncWrap=require("./utilities/asyncWrap.js");
const ExpressErr=require("./utilities/expressError.js");

//----
const engine=require("ejs-mate");
app.engine("ejs",engine);

//passport requiring
const passport=require("passport");
const LocalStrategy=require("passport-local");

//User model require
const User=require("./models/user.js");

//require sessions and flash middleware
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

//session store
let store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 60*60*3,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

// session
let sessionOptions={
    store,      
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+ 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true,
    }
}
app.use(session(sessionOptions));
app.use(flash());


//define after session MW
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser= req.user;
    next();
});



//use routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    let err= new ExpressErr(404,"Page not found");
    next(err);
})

app.use((err, req, res, next)=>{
    let {statusCode=500, message="something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(port, () => {
    console.log("server running on port", port);
})