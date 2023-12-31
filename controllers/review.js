let Listing=require("../models/listing");
let Review=require("../models/review");

module.exports.addReview=async(req,res)=>{
    let {id}=req.params;
    let {review}= req.body;

    let listing= await Listing.findById(id);
    let review1=new Review(review);
    review1.author=req.user._id;

    listing.reviews.push(review1);
    await review1.save();
    await listing.save();
    req.flash("success","review saved");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}