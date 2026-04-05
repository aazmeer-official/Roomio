const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const {isOwner , validateListing , isLoggedin} = require("../middlewares.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../CloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single('listing[image]'), wrapAsync(listingController.addData));


// New Hotel Route - Specific Route
router.get("/new",isLoggedin,wrapAsync(listingController.renderNewForm))
// Note Specific Route ka hameesha dynamic sy upar rkho


router.route("/:id")
.get(wrapAsync(listingController.showData))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.editData))
.delete(isLoggedin,isOwner,wrapAsync(listingController.deleteData))


router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.dynamicEdit))


module.exports = router;