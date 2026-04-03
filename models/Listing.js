const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js")
let url = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const listingSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    description : {
        type:String,
        required:true
    },
    image : {
        type:String,
        default: url,
        set: (v)=> v==="" ? url:v
    },
    price : {
        type:Number,
        required:true
    },
    location: {
        type:String
    },
    country: {
        type:String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});
// 2. The Argument (listing)
// Mongoose automatically passes the document that was just deleted into the function as the listing parameter. This is crucial because even though the listing is gone from the "Listings" collection, its data is still held in memory for this function to use one last time.

// 3. The Condition (if(listing))
// This is a safety check. If the delete command was called but didn't actually find a matching document to delete, listing would be null. This check ensures the code doesn't crash by trying to access properties on something that doesn't exist.





// --- CRITICAL: DEFINE MIDDLEWARE BEFORE COMPILING THE MODEL ---
// Listing MiddleWare for Reviews Deletion

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});





const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
