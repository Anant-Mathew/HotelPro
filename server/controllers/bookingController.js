const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");

const bookRoom = async (req, res) => {
  try {
    const {
      room,
      userid,
      username,
      fromdate,
      todate,
      totalAmount,
      totaldays,
      phone,
      cardDetails
    } = req.body;

    if (!room || !fromdate || !todate || !totalAmount || !phone) {
      return res.status(400).json({ msg: "Incomplete booking details provided" });
    }

    const roomId = room._id || room.roomid || req.body.roomid;
    const roomType = room.type || req.body.type || "Delux Room";

    const newBooking = new bookingModel({
      roomid: roomId,
      type: roomType,
      userid: userid || null,
      username: username || "Guest",
      fromdate,
      todate,
      totalAmount: Number(totalAmount),
      totaldays: Number(totaldays || 1),
      phone: Number(phone),
      cardDetails: cardDetails || {
        cardholdername: username || "Guest",
        cardnumber: "4111222233334444",
        cvvcode: "123",
        expmonthyear: "12/28"
      },
      status: "booked"
    });

    const booking = await newBooking.save();

    // Update room's currentbooking array
    const targetRoom = await roomModel.findById(roomId);
    if (targetRoom) {
      const currentBookings = targetRoom.currentbooking || [];
      currentBookings.push({
        bookingid: booking._id,
        fromdate,
        todate,
        userid,
        status: "booked"
      });
      targetRoom.currentbooking = currentBookings;
      await targetRoom.save();
    }

    return res.status(200).json({
      msg: "Room Booked Successfully!",
      booking
    });
  } catch (error) {
    console.error("bookRoom error:", error);
    return res.status(500).json({ msg: "Booking failed", error: error.message });
  }
};

const getBookingsByUserId = async (req, res) => {
  try {
    const userid = req.body.userid || req.query.userid || req.params.userid;
    if (!userid) {
      return res.status(400).json({ msg: "User ID required" });
    }

    const bookings = await bookingModel.find({ userid });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("getBookingsByUserId error:", error);
    return res.status(500).json({ msg: "Failed to retrieve bookings", error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find({});
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("getAllBookings error:", error);
    return res.status(500).json({ msg: "Failed to retrieve all bookings", error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingid, roomid } = req.body;

    if (!bookingid) {
      return res.status(400).json({ msg: "Booking ID is required" });
    }

    const booking = await bookingModel.findById(bookingid);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    const targetRoomId = roomid || booking.roomid;
    if (targetRoomId) {
      const targetRoom = await roomModel.findById(targetRoomId);
      if (targetRoom && targetRoom.currentbooking) {
        targetRoom.currentbooking = targetRoom.currentbooking.map((b) => {
          if (String(b.bookingid) === String(bookingid)) {
            return { ...b, status: "cancelled" };
          }
          return b;
        });
        await targetRoom.save();
      }
    }

    return res.status(200).json({
      msg: "Your booking has been cancelled successfully",
      status: true
    });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ msg: "Failed to cancel booking", error: error.message });
  }
};

module.exports = {
  bookRoom,
  getBookingsByUserId,
  getAllBookings,
  cancelBooking
};
