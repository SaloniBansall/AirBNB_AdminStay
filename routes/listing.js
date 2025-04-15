const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body); 
    if(error){
        let msg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,msg);
    }else{
        next();
    }

};

router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
        
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    // let {title,description,image,price,country,location}=req.body;
    //let listing=req.body.listing;
    // if(!req.body.listing) throw new ExpressError(400,"Invalid listing data!");


    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
   res.redirect("/listings");

}));

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
        
    }
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);

}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports=router;
