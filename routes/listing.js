const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/Listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchemas} = require("../schema.js")
const Review = require("../models/review.js")


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
router.get("/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs")
}))

// Note Specific Route ka hameesha dynamic sy upar rkho

// Adding DATA - POST Route
// Error Handled as Async Function so adding Next in the catch 


router.post("/",validateListing,wrapAsync(async (req,res)=>{
    let data = req.body.listing;
    await Listing.insertOne(data)
    res.redirect("/listing")
}))

// Editing Using PUT Request
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing)
    res.redirect("/listing")
}))

// Deleting Using DELETE Request
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listing")
}))

// Editing with Dynamic Route

router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("listings/edit.ejs",{data})
}))

// Show Route - Dynamic Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    let reviews = await Review.find({_id:{$in:data.reviews}})
    res.render("listings/show.ejs",{data,reviews})
}))

module.exports = router;