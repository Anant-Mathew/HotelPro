const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  addRoom,
  deleteRoom
} = require("../controllers/roomController");

router.get("/getallrooms", getAllRooms);
router.get("/:id", getRoomById);
router.post("/addroom", addRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
