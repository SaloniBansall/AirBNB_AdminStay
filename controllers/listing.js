// const Listing=require("../models/listing");
// const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
// const mapboxToken=process.env.MAPBOX_TOKEN;
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient=mbxGeocoding({accessToken:mapToken});


// module.exports.index=async (req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});

// };

// module.exports.renderNewForm=(req,res)=>{
//     res.render("listings/new.ejs")
// };

// module.exports.showListing=async(req,res)=>{
//     const {id}=req.params;
//     const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
//     if(!listing){
//         req.flash("error","Listing not found!");
//         res.redirect("/listings");
        
//     }

//     if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
//         try {
//             const geoData = await geocodingClient.forwardGeocode({
//                 query: listing.location,
//                 limit: 1,
//             }).send();

//             if (geoData.body.features.length > 0) {
//                 listing.geometry = geoData.body.features[0].geometry;
//                 await listing.save();
//                 console.log(`Coordinates updated for: ${listing.title}`);
//             } else {
//                 console.log(`No geocoding result for: ${listing.title}`);
//             }
//         } catch (error) {
//             console.error(`Error fetching coordinates for listing: ${listing.title}`, error);
//         }
//     }



//     res.render("listings/show.ejs",{listing});
// };

// module.exports.createListing=async (req,res,next)=>{
//     // let {title,description,image,price,country,location}=req.body;
//     //let listing=req.body.listing;
//     // if(!req.body.listing) throw new ExpressError(400,"Invalid listing data!");

//     let response=await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1,
//     })
//     .send();
//     console.log(response.body.features[0].geometry);

//     const newListing=new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     newListing.geometry=response.body.features[0].geometry;
//     await newListing.save();
//     // c onsole.log(savedListing);
//     req.flash("success", "Successfully created a new listing!");
//    res.redirect("/listings");

// };

// module.exports.editForm=async (req,res)=>{
//     const {id}=req.params;
//     const listing=await Listing.findById(id);
//     if(!listing){
//         req.flash("error","Listing not found!");
//         res.redirect("/listings");
        
//     }
//     res.render("listings/edit.ejs",{listing});

// };

// module.exports.updateListing=async (req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     req.flash("success", "Successfully updated the listing!");
//     res.redirect(`/listings/${id}`);

// };

// module.exports.destroyListing=async (req,res)=>{
//     let {id}=req.params;
//     let deletedListing=await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Successfully deleted the listing!");
//     res.redirect("/listings");
// };
const Listing=require("../models/listing");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken=process.env.MAPBOX_TOKEN;
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    return res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    return res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    
    if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listings");  // ✅ Added return
    }

    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
        try {
            const geoData = await geocodingClient.forwardGeocode({
                query: listing.location,
                limit: 1,
            }).send();

            if (geoData.body.features.length > 0) {
                listing.geometry = geoData.body.features[0].geometry;
                await listing.save();
                console.log(`Coordinates updated for: ${listing.title}`);
            } else {
                console.log(`No geocoding result for: ${listing.title}`);
            }
        } catch (error) {
            console.error(`Error fetching coordinates for listing: ${listing.title}`, error);
        }
    }

    return res.render("listings/show.ejs",{listing});  // ✅ Added return
};

module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    console.log(response.body.features[0].geometry);

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    return res.redirect("/listings");  // ✅ Added return
};

module.exports.editForm=async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    
    if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listings");  // ✅ Added return
    }
    
    return res.render("listings/edit.ejs",{listing});  // ✅ Added return
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Successfully updated the listing!");
    return res.redirect(`/listings/${id}`);  // ✅ Added return
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    return res.redirect("/listings");  // ✅ Added return
};