const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/bookingController.js");

// Route to handle booking request
router.get("/book", bookingController.renderBookingForm);
router.post("/book", wrapAsync(bookingController.sendBookingRequest));

module.exports = router;