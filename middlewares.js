module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You Must be Logged in to perform the Action")
        return res.redirect("/login")
    }
    else{
        next()
    }
}