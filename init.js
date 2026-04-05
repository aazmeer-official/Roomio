const mongoose = require('mongoose');
const Listing = require("./models/Listing.js");
const User = require("./models/User.js")
const sampleListings = require("./data.js")
main()
.then(()=>{console.log("connection Successful")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/roomio');
}





// module.exports = { data: sampleListings };
// Listing.insertMany(sampleListings);


const initDB = async() =>{
  await User.deleteMany({})
  let fakeUser = new User({
    email: "aazmeer.official@gmail.com",
    username:"aaz._.meer",
  });
  const registeredUser = await User.register(fakeUser,"heroA1234")
  let userData = registeredUser._id.toString()
  await Listing.deleteMany({})
  data = sampleListings.map((obj)=>({...obj, owner:userData}))
  await Listing.insertMany(data);
  console.log("Success")
}

initDB()