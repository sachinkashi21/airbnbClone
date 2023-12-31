const { date } = require("joi");
const mongoose = require("mongoose");
const {Schema}= mongoose;

const reviewSchema=Schema({
    content: String,
    rating:{
        type: Number,
        max:5,
        min:0,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

module.exports = mongoose.model("Review",reviewSchema);