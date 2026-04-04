const Review = require("../models/review.js")
const Listing = require("../models/Listing.js")

// Adding Review

module.exports.addReview = async (req,res)=>{
    let data = req.body.review;
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(data)
    newReview.author = req.user._id
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review Created")
    res.redirect(`/listing/${req.params.id}`)
}

// Deleting Review
module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    req.flash("success", "New Review Deleted")
    res.redirect(`/listing/${id}`)
}