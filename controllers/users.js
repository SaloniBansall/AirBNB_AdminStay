const User=require("../models/user");

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    req.login((registeredUser),(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");

    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }


};

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
    };

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
req.flash("success","Welcome back to wanderlust. You are logged in!");
const redirectUrl=res.locals.redirectUrl;
res.redirect(redirectUrl|| "/listings");
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye! You are logged out!");
        res.redirect("/listings");
    })
};