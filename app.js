// BASIC REQUIREMENTS
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Listing = require("./models/Listing.js")
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchemas} = require("./schema.js")
const {reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")
// EXPRESS REQUIREMENTS

app.use(express.urlencoded({extended:true}))  //For Parsing
app.use(express.static(path.join(__dirname,"public"))) // For connecting Public Folder
app.set("view engine", "ejs") //For setting view engine
app.set("views",path.join(__dirname,"views")) //For conecting views folder
app.use(methodOverride('_method'))

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// DATABASE REQUIREMENTS

main()
.then(()=>{console.log("connection Successful")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/roomio');
}

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
// Joi Validation Function - Reviews
validateReviews = async (req, res, next) => {
    try {
        await reviewSchema.validateAsync(req.body);
        next(); // CRITICAL: Move to the next middleware/route
    } catch (err) {
        next(new ExpressError(400, err.message)); // Pass error to Express error handler
    }
};

// Express App

app.get("/",(req,res)=>{
    res.send("Response")
})

// Index Route
app.get("/listing",wrapAsync(async (req,res)=>{
    let datas = await Listing.find()
    res.render("listings/listing.ejs",{datas})
}))


// New Hotel Route - Specific Route
app.get("/listing/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs")
}))

// Note Specific Route ka hameesha dynamic sy upar rkho

// Adding DATA - POST Route
// Error Handled as Async Function so adding Next in the catch 


app.post("/listing",validateListing,wrapAsync(async (req,res)=>{
    let data = req.body.listing;
    await Listing.insertOne(data)
    res.redirect("/listing")
}))

// Editing Using PUT Request
app.put("/listing/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing)
    res.redirect("/listing")
}))

// Deleting Using DELETE Request
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listing")
}))

// Editing with Dynamic Route

app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("listings/edit.ejs",{data})
}))

// Show Route - Dynamic Route
app.get("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    let reviews = await Review.find({_id:{$in:data.reviews}})
    res.render("listings/show.ejs",{data,reviews})
}))                                                  
// Reviews
// Addition of Reviews - POST Route
app.post("/listing/:id/reviews",validateReviews,wrapAsync(async (req,res)=>{
    let data = req.body.review;
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(data)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect(`/listing/${req.params.id}`)
}));

// Deletion of Reviews - Delete Route 

app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    res.redirect(`/listing/${id}`)
}));

// 404 Page Error Throw 
// If the user is sending the request on any page which doesnot exist so we will use it
// app.all with * will check all above routes first and then will give the response if any of the above response doesnot match 


// We learnt a new thing Express k purany version meen woh "*" ko use kr leta tha ab nhi ab is k lye you have to use /.*/ is sy us ko yeh pta lg jay ga that it is originally Regular Expression he 

// 404 Page Error Throw 
// Use a regex literal (no quotes) to bypass the strict string parser
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Adding an Error Handling Middleware

app.use((err,req,res,next)=>{
    let {status=500,message} = err;
    // res.status(status).send(message)
    res.status(status)
    res.render("error.ejs",{message})
})

// Listening
app.listen(port,()=>{
    console.log("server is listening...")
})

