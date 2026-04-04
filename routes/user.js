const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js")
const userController = require("../controllers/user.js")
// SignUp Route

router.route("/signup")
.get(userController.signup)
.post(wrapAsync(userController.addUser))


// Login Route 

router.route("/login")
.get(userController.login)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), userController.postLogin)

// SignOut Route 

router.get("/signout",userController.signout)

module.exports = router