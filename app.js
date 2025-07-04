require("dotenv").config(); 
const express=require("express");
const app=express();
const mongoose=require('mongoose');
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const session=require("express-session");
const mongoStore=require("connect-mongo"); 
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl= process.env.ATLASDB_URL || MONGO_URL; 

const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("session store error");
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, // 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); // pbkdf2 hasging algo is used in passport

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


if (!dbUrl) {
    console.error("MongoDB connection string is not defined. Check your .env file and ATLASDB_URL variable.");
    process.exit(1);
}

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

async function main() {
    await mongoose.connect(dbUrl); // connect with mongo
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi!I am root");
});

// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body); 
//     if(error){
//         let msg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(404,msg);
//     }else{
//         next();
//     }

// };

// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body); 
//     if(error){
//         let msg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(404,msg);
//     }else{
//         next();
//     }

// };

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demoUser",async (req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"student",
    });
    let registeredUser=await User.register(fakeUser,"helloworld"); // register method checks itse;f if user is qunique or not.
    res.send(registeredUser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/listings",wrapAsync(async (req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});

// }));

// //new route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs")
// });

// //show route
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     const {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
// }));

// //create route
// app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
//     // let {title,description,image,price,country,location}=req.body;
//     //let listing=req.body.listing;
//     // if(!req.body.listing) throw new ExpressError(400,"Invalid listing data!");


//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//    res.redirect("/listings");

// }));

// //edit route
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     const {id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});

// }));

// //update route
// app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
//     const {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);

// }));

// //delete route
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let deletedListing=await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

// reviews post route
// app.post("/listings/:id/reviews",validateReview , wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${req.params.id}`);
// }));


// // delete review route

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id, reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));


app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found",404));
});


// middleware to define error 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("server has started");
});