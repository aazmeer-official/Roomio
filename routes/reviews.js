const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const {validateReviews, isReviewAuthor ,isLoggedin} = require("../middlewares.js")
const reviewsController = require("../controllers/reviews.js")


// Reviews

// Addition of Reviews - POST Route
router.post("/",validateReviews,isLoggedin,wrapAsync(reviewsController.addReview));

// Deletion of Reviews - Delete Route 

router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewsController.deleteReview));


module.exports = router;