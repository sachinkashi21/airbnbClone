const mongoose = require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        url: {
            type: String,
            default: "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg",
            set: (v) =>  v === ""
            ? "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg"
            : v ,
        },
        filename: {
            type: String,
            default: "filename"
        },
    },
    location: {
        type: String,
    },
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum:["Pool-equiped","Beach","Castles","Farms","Mansions","Camping","Mountain-side","Arctic","Boat-house","Island","none"]
    },
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
      }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing.reviews.length){
        console.log(listing);
        let result=await Review.deleteMany({_id:{$in: listing.reviews}});
        console.log(result);
    }
})
const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;