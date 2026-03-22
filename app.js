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
const listing = require("./routes/listing");
const reviews = require("./routes/reviews");

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



// Express App
    app.get("/",(req,res)=>{
        res.send("response!")
    })                                          

    app.use("/listing", listing);
    app.use("/listing/:id/reviews", reviews);



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

