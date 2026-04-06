// .env File
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
// console.log(process.env.SECRET)

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
const listingRouter = require("./routes/listing");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user.js");
const session = require('express-session') // Using Session for making a temporary cookie


// Passport - Authentication
const passport = require('passport')
const LocalStrategy = require("passport-local")
const User = require("./models/User.js")


// Using Flash
const flash = require('connect-flash');
const sessionOptions = {
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

// EXPRESS REQUIREMENTS

app.use(express.urlencoded({extended:true}))  //For Parsing
app.use(express.static(path.join(__dirname,"public"))) // For connecting Public Folder
app.set("view engine", "ejs") //For setting view engine
app.set("views",path.join(__dirname,"views")) //For conecting views folder
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);  // use ejs-locals for all ejs templates:

// Express App
    // app.get("/",(req,res)=>{
    //     res.send("response!")
    // }) 


// Using Flash
app.use(session(sessionOptions)); //Creating Session Cookie and adding Session Options
app.use(flash());  

// Passport - Configuration
app.use(passport.initialize());
app.use(passport.session());

// Use passport.use() for strategies, NOT app.use()
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Remember Flash Middleware should always be above the Express Routes

// Creating Middleware for Flash  - Locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next() //Important to call next
})


// DATABASE REQUIREMENTS
main()
.then(()=>{console.log("connection Successful")})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/roomio');
}
                               
// Express Routes
    app.use("/listing", listingRouter);
    app.use("/listing/:id/reviews", reviewsRouter);
    app.use("/",userRouter)



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

