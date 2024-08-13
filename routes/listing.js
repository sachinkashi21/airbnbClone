const express=require("express");
const router=express.Router();

//error handling for async mongoose error and custom errors 
const asyncWrap=require("../utilities/asyncWrap.js");
// const ExpressErr=require("../utilities/expressError.js");

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage}); 

//middleware require
const {isLoggedIn, isOwner, validateListingSchema}=require("../middlewares.js");

//controller require
const listingController = require("../controllers/listing.js");


//routes

router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListingSchema,asyncWrap(listingController.addNewListing))

router.get("/new",isLoggedIn,listingController.newListingForm);
router.get("/search",listingController.searchBar)

router.route("/:id")
.get(asyncWrap(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),asyncWrap(listingController.editListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing))

router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.editListingForm));

router.delete("/:id",(req,res)=>{
    ....;
})


module.exports=router;