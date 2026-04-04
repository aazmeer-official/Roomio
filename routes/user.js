const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js")
const userController = require("../controllers/user.js")
// SignUp Route

router.get("/signup", userController.signup)
 
router.post("/signup",wrapAsync(userController.addUser))

// Login Route 
 
router.get("/login",userController.login)

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:"/login",
        failureFlash:true}),
        userController.postLogin)

// SignOut Route 

router.get("/signout",userController.signout)

module.exports = router