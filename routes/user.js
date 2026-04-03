const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const User = require("../models/User.js");
const passport = require("passport");


// SignUp Route

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({
            email,username
        })
        const registeredUser =  await User.register(newUser,password)
        console.log(registeredUser)
        req.flash("success", "Welcome to Roomio")
        res.redirect("/listing")
    }catch(e){

        req.flash("error", e.message)
        res.redirect("/signup")
    }
}))

// Login Route 
 
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",passport.authenticate("local", {failureRedirect:"/login",failureFlash:true}), async (req,res)=>{
    req.flash("success","Welcome Back to Roomio")
    res.redirect("/listing")
})

// SignOut Route 

router.get("/signout",(req,res,next)=>{
    // This block will check if the user is signed in or not 
    if(!req.isAuthenticated()){
        req.flash("error","You are not logged in")
        return res.redirect("/login")
    }
    // This block will execute the signout strategy
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Logged Out Successfully")
        res.redirect("/listing")
    })
})

module.exports = router