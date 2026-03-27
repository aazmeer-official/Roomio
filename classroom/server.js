const express = require("express");
const app = express();
const port = 8080;
const session = require('express-session')
const flash = require('connect-flash');
const path = require("path");
app.set("view engine", "ejs") //For setting view engine
app.set("views",path.join(__dirname,"views")) //For conecting views folder

const sessionOptions = {
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
} 

// MiddleWares
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.messages = req.flash("success")
    res.locals.errors = req.flash("error")
    next()
})

app.get("/get",(req,res)=>{
    res.send("Hi")
})

// app.get("/reqcount",(req,res)=>{
//     // req.session.count = 1; //Variable store kya he 
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }

//     res.send(req.session.count)
// })


app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error","User not Registered Successful")
    }else{
    req.flash("success","User Registered Successful")
    }
    res.redirect("/hello")
})

app.get("/hello", (req,res)=>{

    res.render("page.ejs",{name:req.session.name})
})
// Listening
app.listen(port,()=>{
    console.log("server is listening...")
})