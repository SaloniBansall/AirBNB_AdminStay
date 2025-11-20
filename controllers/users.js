// const User=require("../models/user");

// module.exports.signup = async (req, res, next) => {
//     try {
//         let { username, email, password } = req.body;
//         let newUser = new User({ username, email });
//         const registeredUser = await User.register(newUser, password);
        
//         req.login(registeredUser, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             req.flash("success", "Welcome to Wanderlust!");
//             return res.redirect("/listings");
//         });
        
//         // ✅ Add return here to prevent further execution
//         return;
        
//     } catch (e) {
//         req.flash("error", e.message);
//         return res.redirect("/signup");
//     }
// };

// module.exports.renderSignup=(req,res)=>{
//     res.render("users/signup.ejs");
//     };

// module.exports.renderLogin=(req,res)=>{
//     res.render("users/login.ejs");
// };

// module.exports.login=async(req,res)=>{
// req.flash("success","Welcome back to wanderlust. You are logged in!");
// const redirectUrl=res.locals.redirectUrl;
// res.redirect(redirectUrl|| "/listings");
// };

// module.exports.logout=(req,res)=>{
//     req.logout((err)=>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success","Goodbye! You are logged out!");
//         res.redirect("/listings");
//     })
// };
const User=require("../models/user");

module.exports.signup=async(req,res,next)=>{  // ✅ Added 'next' parameter
    try{
        let {username,email,password}=req.body;
        let newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);  // ✅ Now 'next' is defined
            }
            req.flash("success","Welcome to Wanderlust!");
            return res.redirect("/listings");  // ✅ Added return
        })
    }catch(e){
        req.flash("error",e.message);
        return res.redirect("/signup");  // ✅ Added return
    }
};

module.exports.renderSignup=(req,res)=>{
    return res.render("users/signup.ejs");  // ✅ Added return
};

module.exports.renderLogin=(req,res)=>{
    return res.render("users/login.ejs");  // ✅ Added return
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust. You are logged in!");
    const redirectUrl=res.locals.redirectUrl;
    return res.redirect(redirectUrl|| "/listings");  // ✅ Added return
};

module.exports.logout=(req,res,next)=>{  // ✅ Added 'next' parameter
    req.logout((err)=>{
        if(err){
            return next(err);  // ✅ Now 'next' is defined
        }
        req.flash("success","Goodbye! You are logged out!");
        return res.redirect("/listings");  // ✅ Added return
    })
};