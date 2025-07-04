const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");

const {validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//search route

router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.redirect('/listings');

    const regex = new RegExp(query, 'i');
    const filteredListings = await Listing.find({ title: { $regex: regex } });    // $or: [{ title: { $regex: regex } },{ location: { $regex: regex } } can use this if want to search by location also

    res.render('listings/index', { allListings: filteredListings }); // ✅ Correct name
});


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//index route
//router.get("/",wrapAsync(listingController.index));



//show route
// router.get("/:id",wrapAsync(listingController.showListing));

//create route
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editForm));

//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// search route 


module.exports=router;
