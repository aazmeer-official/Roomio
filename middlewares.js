const Listing = require("./models/Listing")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchemas} = require("./schema.js")
const {reviewSchema} = require("./schema.js")
const Review = require("./models/review")
module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Only save the URL if it's a GET request
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else {
            // For DELETE/POST, redirect back to the listing page instead of the action path
            // Extract the listing ID from the URL if possible, or just use a default
            req.session.redirectUrl = req.headers.referer || "/listings";
        }
        
        req.flash("error", "You must be logged in to perform the action");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

// Joi Validation Function - Listing
    module.exports.validateListing = async(req,res,next)=>{
            try {
        const value = await listingSchemas.validateAsync(req.body);
        next()
    }
    catch (err) {
        next(new ExpressError(400, err.message));
     }
    }

// Joi Validation Function - Reviews
module.exports.validateReviews = async (req, res, next) => {
    try {
        await reviewSchema.validateAsync(req.body);
        next(); // CRITICAL: Move to the next middleware/route
    } catch (err) {
        next(new ExpressError(400, err.message)); // Pass error to Express error handler
    }
};


module.exports.isReviewAuthor = async(req,res,next)=>{
   let {id, reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of Review")
        return res.redirect(`/listing/${id}`)
    }
    next()
}
