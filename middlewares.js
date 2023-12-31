let Listing=require("./models/listing.js");
let Review=require("./models/review.js");
const ExpressErr=require("./utilities/expressError.js");

const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.method=="GET"){
            req.session.redirectUrl=req.originalUrl;
        }
        req.flash("error","Please Login to Continue");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let currListing= await Listing.findById(id);
    if(!currListing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor= async(req,res,next)=>{
    let {id, reviewId}= req.params;
    let currReview=await Review.findById(reviewId);
    if(!currReview.author.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Schema Validation middleware
module.exports.validateListingSchema=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    let err=result.error;
    if(err){
        let errMsg=err.details.map((ele)=>ele.message).join(",");
        throw new ExpressErr(400, errMsg);
    } else{
        next();
    }
}
module.exports.validateReviewSchema=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    let err=result.error;
    if(err){
        let errMsg=err.details.map((ele)=>ele.message).join(",");
        throw new ExpressErr(400, errMsg);
    } else{
        next();
    }
}
