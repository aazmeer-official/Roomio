const express = require("express");
const app = express();
const port = 8080;
const session = require('express-session')
app.use(session({
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
}))


app.get("/get",(req,res)=>{
    res.send("Hi")
})

app.get("/reqcount",(req,res)=>{
    // req.session.count = 1; //Variable store kya he 
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }

    res.send(req.session.count)
})


// Listening
app.listen(port,()=>{
    console.log("server is listening...")
})