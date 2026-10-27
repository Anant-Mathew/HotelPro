// ==========================================
// HOTELPRO / ROOMLY BACKEND SERVER
// Written with Express, Node.js and MongoDB
// ==========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const { connectDB, getStatus } = require("./config/db");
const userModel = require("./models/userModel");
const roomModel = require("./models/roomModel");
const bookingModel = require("./models/bookingModel");

const app = express();
const PORT = process.env.PORT || 8001;
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey123";

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to database (with automatic fallback so it never crashes)
connectDB();

// ------------------------------------------
// 1. SIGNUP API
// ------------------------------------------
app.post("/SignUp", async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    // check if user already exists
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(400).send({ msg: "Email already register", status: "false" });
    }

    // hashing password using bcrypt
    const pass = password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    // saving new user to database
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: userType || "Ordinary"
    });

    res.status(200).send({ msg: "User registered successfully", status: true, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Inernal server error", error: error.message });
  }
});

// ------------------------------------------
// 2. LOGIN API
// ------------------------------------------
app.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ msg: "Invalid email or password", status: false });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid email or password", status: false });
    }

    // create jwt token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      msg: "Login successful",
      status: true,
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Inernal server error", error: error.message });
  }
});

// ------------------------------------------
// 3. GET ALL ROOMS API
// ------------------------------------------
app.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await roomModel.find({});
    res.status(200).send(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ------------------------------------------
// 4. ADD ROOM API
// ------------------------------------------
app.post("/addroom", async (req, res) => {
  try {
    const newRoom = new roomModel(req.body);
    const room = await newRoom.save();
    res.send(room);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ------------------------------------------
// 5. BOOK ROOM API
// ------------------------------------------
app.post("/bookroom", async (req, res) => {
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

    const roomId = room ? (room._id || room.roomid) : req.body.roomid;
    const roomType = room ? (room.type || "Delux") : (req.body.type || "Delux");

    // create new booking
    const newBooking = new bookingModel({
      roomid: roomId,
      type: roomType.includes("Room") ? roomType : `${roomType} Room`,
      userid: userid,
      username: username || "Guest",
      fromdate: fromdate,
      todate: todate,
      totalAmount: totalAmount,
      totaldays: totaldays || 1,
      phone: phone || 9704927807,
      cardDetails: cardDetails || {
        cardholdername: username,
        cardnumber: "4111222233334444",
        cvvcode: "123",
        expmonthyear: "12/28"
      },
      status: "booked"
    });

    const booking = await newBooking.save();

    // push to currentbooking in room
    const currentRoom = await roomModel.findById(roomId);
    if (currentRoom) {
      if (!currentRoom.currentbooking) {
        currentRoom.currentbooking = [];
      }
      currentRoom.currentbooking.push({
        bookingid: booking._id,
        fromdate: fromdate,
        todate: todate,
        userid: userid,
        status: "booked"
      });
      await currentRoom.save();
    }

    res.send({ msg: "Room booked successfully!", booking: booking });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ------------------------------------------
// 6. GET BOOKINGS BY USER ID API
// ------------------------------------------
app.post("/getbookingsbyuserid", async (req, res) => {
  try {
    const userid = req.body.userid;
    const bookings = await bookingModel.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ------------------------------------------
// 7. GET ALL BOOKINGS API (ADMIN)
// ------------------------------------------
app.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await bookingModel.find({});
    res.send(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ------------------------------------------
// 8. CANCEL BOOKING API
// ------------------------------------------
app.post("/cancelbooking", async (req, res) => {
  try {
    const { bookingid, roomid } = req.body;

    // update booking status
    const booking = await bookingModel.findById(bookingid);
    if (booking) {
      booking.status = "cancelled";
      await booking.save();
    }

    // update room currentbooking status
    const targetRoomId = roomid || (booking ? booking.roomid : null);
    if (targetRoomId) {
      const room = await roomModel.findById(targetRoomId);
      if (room && room.currentbooking) {
        room.currentbooking = room.currentbooking.map((b) => {
          if (b.bookingid == bookingid) {
            b.status = "cancelled";
          }
          return b;
        });
        await room.save();
      }
    }

    res.send({ msg: "Booking cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// ------------------------------------------
// 9. GET ALL USERS API (ADMIN)
// ------------------------------------------
app.get("/getallusers", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Serve frontend build if exists
const clientDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
