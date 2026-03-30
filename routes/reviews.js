const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/Listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../schema.js")
const Review = require("../models/review.js")


// Joi Validation Function - Reviews
validateReviews = async (req, res, next) => {
    try {
        await reviewSchema.validateAsync(req.body);
        next(); // CRITICAL: Move to the next middleware/route
    } catch (err) {
        next(new ExpressError(400, err.message)); // Pass error to Express error handler
    }
};


// Reviews
// Addition of Reviews - POST Route
router.post("/",validateReviews,wrapAsync(async (req,res)=>{
    let data = req.body.review;
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(data)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review Created")
    res.redirect(`/listing/${req.params.id}`)
}));

// Deletion of Reviews - Delete Route 

router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    req.flash("success", "New Review Deleted")
    res.redirect(`/listing/${id}`)
}));


module.exports = router;