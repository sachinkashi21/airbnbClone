const express=require("express");
const router=express.Router({mergeParams: true});
 
const asyncWrap=require("../utilities/asyncWrap.js");
// const ExpressErr=require("../utilities/expressError.js");

//models
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

//Schema Validation middleware 
const {validateReviewSchema, isLoggedIn, isAuthor}=require("../middlewares.js");

const reviewController=require("../controllers/review.js");

//routes
router.post("/",isLoggedIn ,validateReviewSchema ,asyncWrap(reviewController.addReview));

router.delete("/:reviewId",isLoggedIn, isAuthor ,asyncWrap(reviewController.destroyReview));

module.exports=router;
