const roomModel = require("../models/roomModel");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomModel.find({});
    return res.status(200).json(rooms);
  } catch (error) {
    console.error("getAllRooms error:", error);
    return res.status(500).json({ msg: "Failed to retrieve rooms", error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomModel.findById(id);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }
    return res.status(200).json(room);
  } catch (error) {
    console.error("getRoomById error:", error);
    return res.status(500).json({ msg: "Failed to retrieve room", error: error.message });
  }
};

const addRoom = async (req, res) => {
  try {
    const { roomNumber, count, rent, type, photos, description } = req.body;

    if (!roomNumber || !rent || !type || !description) {
      return res.status(400).json({ msg: "Missing required room fields" });
    }

    const newRoom = new roomModel({
      roomNumber: Number(roomNumber),
      count: Number(count || 1),
      rent: Number(rent),
      type: type.trim(),
      photos: Array.isArray(photos) ? photos.filter((p) => p && p.trim() !== "") : [],
      description: description.trim(),
      currentbooking: []
    });

    const savedRoom = await newRoom.save();
    return res.status(200).json(savedRoom);
  } catch (error) {
    console.error("addRoom error:", error);
    return res.status(500).json({ msg: "Failed to add room", error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await roomModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ msg: "Room not found" });
    }
    return res.status(200).json({ msg: "Room deleted successfully", deleted });
  } catch (error) {
    console.error("deleteRoom error:", error);
    return res.status(500).json({ msg: "Failed to delete room", error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  addRoom,
  deleteRoom
};
