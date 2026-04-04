const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/Listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js")
const {validateReviews, isReviewAuthor} = require("../middlewares.js")
const {isLoggedin} = require("../middlewares.js")



// Reviews
// Addition of Reviews - POST Route
router.post("/",validateReviews,isLoggedin,wrapAsync(async (req,res)=>{
    let data = req.body.review;
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(data)
    newReview.author = req.user._id
    console.log(newReview)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review Created")
    res.redirect(`/listing/${req.params.id}`)
}));

// Deletion of Reviews - Delete Route 

router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    req.flash("success", "New Review Deleted")
    res.redirect(`/listing/${id}`)
}));


module.exports = router;