const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const {isOwner , validateListing , isLoggedin} = require("../middlewares.js")
const listingController = require("../controllers/listing.js")

// Index Route
router.get("/",wrapAsync(listingController.index))


// New Hotel Route - Specific Route
router.get("/new",isLoggedin,wrapAsync(listingController.renderNewForm))

// Note Specific Route ka hameesha dynamic sy upar rkho

// Adding DATA - POST Route
// Error Handled as Async Function so adding Next in the catch 


// Adding DATA - POST Route
router.post("/",isLoggedin, validateListing, wrapAsync(listingController.addData));

// Editing Using PUT Request
router.put("/:id",isLoggedin,isOwner,validateListing,wrapAsync(listingController.editData))

// Deleting Using DELETE Request
router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteData))

// Editing with Dynamic Route

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.dynamicEdit))

// Show Route - Dynamic Route
router.get("/:id",wrapAsync(listingController.showData))

module.exports = router;