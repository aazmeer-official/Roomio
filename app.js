// BASIC REQUIREMENTS
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Listing = require("./models/Listing.js")
const ejsMate = require('ejs-mate');

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
    res.send("Response")
})

// Index Route
app.get("/listing",async (req,res)=>{
    let datas = await Listing.find()
    res.render("listings/listing.ejs",{datas})
})


// New Hotel Route - Specific Route
app.get("/listing/new",async (req,res)=>{
    res.render("listings/new.ejs")
})

// Note Specific Route ka hameesha dynamic sy upar rkho

// Adding DATA - POST Route

app.post("/listing",async (req,res)=>{
    let data = req.body;
    await Listing.insertOne(data)
    res.redirect("/listing")
})

// Editing Using PUT Request
app.put("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body)
    res.redirect("/listing")
})

// Deleting Using DELETE Request
app.delete("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listing")
})

// Editing with Dynamic Route

app.get("/listing/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("listings/edit.ejs",{data})
})

// Show Route - Dynamic Route
app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("listings/show.ejs",{data})
})

// Adding an Error Handling Middleware

app.use((err,req,res,next)=>{
    let{status=500,message} = err;
    res.status(status).send(message)
    next()
})

// Listening
app.listen(port,()=>{
    console.log("server is listening...")
})

