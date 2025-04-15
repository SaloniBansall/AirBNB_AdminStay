const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
    if(error){
        let msg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,msg);
    }else{
        next();
    }

};



router.post("/",validateReview , wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${req.params.id}`);
}));


// delete review route

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/listings/${id}`);
}));


module.exports=router;