let Listing=require("../models/listing.js");
const ExpressErr=require("../utilities/expressError.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req,res,next)=>{
    if(!req.query.q){
        let arrList=await Listing.find();
        return res.render("listings/index.ejs",{arrList});
    }
    let q=req.query.q;
    let arrList=await Listing.find({category:q});
    return res.render("listings/index.ejs",{arrList});
    }

module.exports.newListingForm= (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.searchBar= async (req,res)=>{
    let arrList=await Listing.find({category:req.query.search});
    res.render("listings/index.ejs",{arrList});
   
}
module.exports.addNewListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let listing=req.body.listing;
    console.log(listing);

    let response=await geocodingClient
        .forwardGeocode({
            query: listing.location,
            limit:1
        })
        .send();
    
    let newListing= new Listing(listing);
    newListing.image.url=url;
    newListing.image.filename=filename;
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    console.log(newListing.geometry);
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","listing Saved");
    res.redirect("/listings");
}

module.exports.showListing=async (req,res,next)=>{
    let {id}=req.params;
    let list=await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{
                path:"author"
            }
        })    
        .populate("owner");
    // console.log(list);
    if(!list){
        req.flash("error","listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}

module.exports.editListingForm=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalUrl});
}

module.exports.editListing=async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressErr(400, "Send a valid data for listing");
    }
    let {id}=req.params;
    let listing=req.body.listing;
    let editListing=await Listing.findByIdAndUpdate(id,{...listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        editListing.image.url=url;
        editListing.image.filename=filename;
        await editListing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}