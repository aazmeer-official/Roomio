const User = require("../models/User.js");

module.exports.signup = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.addUser = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({
            email,username
        })
        const registeredUser =  await User.register(newUser,password)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }else{
            req.flash("success","Welcome to Roomio")
            res.redirect(req.session.redirectUrl || "/listing")
        }
        })
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.login = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.postLogin = async (req,res)=>{
    req.flash("success","Welcome Back to Roomio")
    res.redirect(res.locals.redirectUrl || "/listing")
}

module.exports.signout = (req,res,next)=>{
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
}