const mongoose = require("mongoose");
const { getStatus } = require("../config/db");
const { generateId, loadData, saveData } = require("../data/store");

// Mongoose Schema Definition
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    userType: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

let MongooseUserModel;
try {
  MongooseUserModel = mongoose.model("users", userSchema);
} catch (e) {
  MongooseUserModel = mongoose.models.users;
}

// Unified Model Interface
const userModel = {
  findOne: async (query) => {
    if (getStatus()) {
      return await MongooseUserModel.findOne(query);
    }
    const db = loadData();
    const user = db.users.find((u) => {
      for (const key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });
    return user ? { ...user } : null;
  },

  findById: async (id) => {
    if (getStatus()) {
      return await MongooseUserModel.findById(id);
    }
    const db = loadData();
    const user = db.users.find((u) => u._id === id);
    return user ? { ...user } : null;
  },

  find: async (query = {}) => {
    if (getStatus()) {
      return await MongooseUserModel.find(query);
    }
    const db = loadData();
    return db.users.filter((u) => {
      for (const key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });
  },

  create: async (data) => {
    if (getStatus()) {
      return await MongooseUserModel.create(data);
    }
    const db = loadData();
    const newUser = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveData(db);
    return newUser;
  },

  findByIdAndDelete: async (id) => {
    if (getStatus()) {
      return await MongooseUserModel.findByIdAndDelete(id);
    }
    const db = loadData();
    const idx = db.users.findIndex((u) => u._id === id);
    if (idx !== -1) {
      const removed = db.users.splice(idx, 1)[0];
      saveData(db);
      return removed;
    }
    return null;
  }
};

module.exports = userModel;
