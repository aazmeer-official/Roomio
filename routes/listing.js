const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/Listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchemas} = require("../schema.js")
const Review = require("../models/review.js")
const {isLoggedin} = require("../middlewares.js")

// Joi Validation Function - Listing
    validateListing = async(req,res,next)=>{
            try {
        const value = await listingSchemas.validateAsync(req.body);
        next()
    }
    catch (err) {
        next(new ExpressError(400, err.message));
        
     }
    }


// Index Route
router.get("/",wrapAsync(async (req,res)=>{
    let datas = await Listing.find()
    res.render("listings/listing.ejs",{datas})
}))


// New Hotel Route - Specific Route
router.get("/new",isLoggedin,wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs")
}))

// Note Specific Route ka hameesha dynamic sy upar rkho

// Adding DATA - POST Route
// Error Handled as Async Function so adding Next in the catch 


// Adding DATA - POST Route
router.post("/",isLoggedin, validateListing, wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing); // Create instance
    newListing.owner = req.user._id;
    await newListing.save(); // Save to DB
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
}));

// Editing Using PUT Request
router.put("/:id",isLoggedin,validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing)
    req.flash("success", "Listing Updated Successfully!")
    res.redirect("/listing")
}))

// Deleting Using DELETE Request
router.delete("/:id",isLoggedin,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted Succesfully")
    res.redirect("/listing")
}))

// Editing with Dynamic Route

router.get("/:id/edit",isLoggedin,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    if(!data){
    req.flash("error", "Listing Doesnot Exist!");
    res.redirect("/listing");
    }else{
    res.render("listings/edit.ejs",{data})
    }
}))

// Show Route - Dynamic Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate("reviews").populate("owner")
    // Agar kissi unknown yan deleted listing ki baat ho rahi ho
    if(!data){
        req.flash("error", "Listing Doesnot Exist!");
        res.redirect("/listing");
    }else{
        console.log(data)
    res.render("listings/show.ejs",{data})
    }

}))

module.exports = router;