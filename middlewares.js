const Listing = require("./models/Listing")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchemas} = require("./schema.js")
const {reviewSchema} = require("./schema.js")

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You Must be Logged in to perform the Action")
        return res.redirect("/login")
    }
    else{
        next()
    }
}

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