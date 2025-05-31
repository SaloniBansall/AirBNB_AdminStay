const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    // image:{
    //     url:String,
    //     filname:String,

    // },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"],
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }

    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
        
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({
            _id: {
                $in: listing.reviews,
            }
        });

    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
