const mongoose = require('mongoose');
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
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
