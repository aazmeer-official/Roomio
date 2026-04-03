const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const User = require("../models/User.js")



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

module.exports = router