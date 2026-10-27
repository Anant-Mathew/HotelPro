const express = require("express");
const router = express.Router();
const {
  bookRoom,
  getBookingsByUserId,
  getAllBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/bookroom", bookRoom);
router.post("/getbookingsbyuserid", getBookingsByUserId);
router.get("/getbookingsbyuserid/:userid", getBookingsByUserId);
router.get("/getallbookings", getAllBookings);
router.post("/cancelbooking", cancelBooking);

module.exports = router;
