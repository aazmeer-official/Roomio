const Listing = require("../models/Listing")
// Index Route 
module.exports.index = async (req,res)=>{
    let datas = await Listing.find()
    res.render("listings/listing.ejs",{datas})
}
// New Route 
module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new.ejs")
}
// Adding Data
module.exports.addData = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing); // Create instance
    newListing.owner = req.user._id;
    newListing.image = {url,filename}
    await newListing.save(); // Save to DB
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
}
// Edit Data
module.exports.editData = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!")
    res.redirect("/listing")
}
// Delete Data
module.exports.deleteData = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted Succesfully")
    res.redirect("/listing")
}
// Edit with Dynamic Route 
module.exports.dynamicEdit = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    if(!data){
    req.flash("error", "Listing Doesnot Exist!");
    res.redirect("/listing");
    }else{
    res.render("listings/edit.ejs",{data})
    }
}

// Show Route 
module.exports.showData = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner")
    // Agar kissi unknown yan deleted listing ki baat ho rahi ho
    if(!data){
        req.flash("error", "Listing Doesnot Exist!");
        res.redirect("/listing");
    }else{
    res.render("listings/show.ejs",{data})
    }
}