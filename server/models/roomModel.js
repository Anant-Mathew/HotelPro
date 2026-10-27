const mongoose = require("mongoose");
const { getStatus } = require("../config/db");
const { generateId, loadData, saveData } = require("../data/store");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true },
    count: { type: Number, required: true },
    rent: { type: Number, required: true },
    type: { type: String, required: true },
    photos: { type: [String], default: [] },
    description: { type: String, required: true },
    currentbooking: { type: Array, default: [] }
  },
  {
    timestamps: true
  }
);

let MongooseRoomModel;
try {
  MongooseRoomModel = mongoose.model("rooms", roomSchema);
} catch (e) {
  MongooseRoomModel = mongoose.models.rooms;
}

class RoomModelMock {
  constructor(data) {
    this._doc = {
      _id: generateId(),
      photos: [],
      currentbooking: [],
      ...data,
      roomNumber: Number(data.roomNumber),
      count: Number(data.count || data.capacity || 1),
      rent: Number(data.rent),
      createdAt: new Date().toISOString()
    };
    Object.assign(this, this._doc);
  }

  async save() {
    if (getStatus()) {
      const doc = new MongooseRoomModel(this._doc);
      return await doc.save();
    }
    const db = loadData();
    db.rooms.push(this._doc);
    saveData(db);
    return this._doc;
  }
}

// Attach static methods to RoomModelMock
RoomModelMock.find = async function (query = {}) {
  if (getStatus()) {
    return await MongooseRoomModel.find(query);
  }
  const db = loadData();
  return db.rooms.filter((r) => {
    for (const key in query) {
      if (r[key] !== query[key]) return false;
    }
    return true;
  });
};

RoomModelMock.findById = async function (id) {
  if (getStatus()) {
    return await MongooseRoomModel.findById(id);
  }
  const db = loadData();
  const room = db.rooms.find((r) => r._id === id);
  if (!room) return null;
  return {
    ...room,
    save: async function () {
      const dbFresh = loadData();
      const idx = dbFresh.rooms.findIndex((r) => r._id === id);
      if (idx !== -1) {
        dbFresh.rooms[idx] = { ...this };
        saveData(dbFresh);
      }
      return this;
    }
  };
};

RoomModelMock.findByIdAndUpdate = async function (id, update, options) {
  if (getStatus()) {
    return await MongooseRoomModel.findByIdAndUpdate(id, update, options);
  }
  const db = loadData();
  const idx = db.rooms.findIndex((r) => r._id === id);
  if (idx !== -1) {
    db.rooms[idx] = { ...db.rooms[idx], ...update };
    saveData(db);
    return db.rooms[idx];
  }
  return null;
};

RoomModelMock.create = async function (data) {
  const instance = new RoomModelMock(data);
  return await instance.save();
};

RoomModelMock.findByIdAndDelete = async function (id) {
  if (getStatus()) {
    return await MongooseRoomModel.findByIdAndDelete(id);
  }
  const db = loadData();
  const idx = db.rooms.findIndex((r) => r._id === id);
  if (idx !== -1) {
    const removed = db.rooms.splice(idx, 1)[0];
    saveData(db);
    return removed;
  }
  return null;
};

module.exports = RoomModelMock;
