const mongoose = require("mongoose");
const { getStatus } = require("../config/db");
const { generateId, loadData, saveData } = require("../data/store");

const bookingsSchema = new mongoose.Schema(
  {
    roomid: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    type: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    username: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    totaldays: { type: Number, required: true },
    phone: { type: Number, required: true },
    cardDetails: {
      cardholdername: { type: String, required: true },
      cardnumber: { type: String, required: true },
      cvvcode: { type: String, required: true },
      expmonthyear: { type: String, required: true }
    },
    status: { type: String, default: "booked" }
  },
  { timestamps: true }
);

let MongooseBookingModel;
try {
  MongooseBookingModel = mongoose.model("Booking", bookingsSchema);
} catch (e) {
  MongooseBookingModel = mongoose.models.Booking;
}

class BookingModelMock {
  constructor(data) {
    this._doc = {
      _id: generateId(),
      status: "booked",
      ...data,
      totalAmount: Number(data.totalAmount),
      totaldays: Number(data.totaldays),
      phone: Number(data.phone),
      createdAt: new Date().toISOString()
    };
    Object.assign(this, this._doc);
  }

  async save() {
    if (getStatus()) {
      const doc = new MongooseBookingModel(this._doc);
      return await doc.save();
    }
    const db = loadData();
    db.bookings.push(this._doc);
    saveData(db);
    return this._doc;
  }
}

BookingModelMock.find = async function (query = {}) {
  if (getStatus()) {
    return await MongooseBookingModel.find(query);
  }
  const db = loadData();
  const list = db.bookings.filter((b) => {
    for (const key in query) {
      if (String(b[key]) !== String(query[key])) return false;
    }
    return true;
  });
  return list;
};

BookingModelMock.findById = async function (id) {
  if (getStatus()) {
    return await MongooseBookingModel.findById(id);
  }
  const db = loadData();
  const booking = db.bookings.find((b) => String(b._id) === String(id));
  if (!booking) return null;
  return {
    ...booking,
    save: async function () {
      const dbFresh = loadData();
      const idx = dbFresh.bookings.findIndex((b) => String(b._id) === String(id));
      if (idx !== -1) {
        dbFresh.bookings[idx] = { ...this };
        saveData(dbFresh);
      }
      return this;
    }
  };
};

BookingModelMock.findByIdAndUpdate = async function (id, update, options) {
  if (getStatus()) {
    return await MongooseBookingModel.findByIdAndUpdate(id, update, options);
  }
  const db = loadData();
  const idx = db.bookings.findIndex((b) => String(b._id) === String(id));
  if (idx !== -1) {
    db.bookings[idx] = { ...db.bookings[idx], ...update };
    saveData(db);
    return db.bookings[idx];
  }
  return null;
};

BookingModelMock.create = async function (data) {
  const instance = new BookingModelMock(data);
  return await instance.save();
};

module.exports = BookingModelMock;
