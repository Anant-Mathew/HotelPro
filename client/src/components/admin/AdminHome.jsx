// ==========================================
// ADMIN DASHBOARD (ADMINHOME)
// ==========================================
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminHome() {
  // state for active tab (matching MDBTabs: ALL BOOKINGS, ALL ROOMS, ADD ROOM, ALL USER)
  const [activeTab, setActiveTab] = useState("bookings");

  // data states
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  // add room form state
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [rent, setRent] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [roomType, setRoomType] = useState("Delux");
  const [description, setDescription] = useState("");

  // fetch data when component loads
  useEffect(() => {
    loadAllBookings();
    loadAllRooms();
    loadAllUsers();
  }, []);

  // API calls
  const loadAllBookings = async () => {
    try {
      const res = await axios.get("/getallbookings");
      setBookings(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadAllRooms = async () => {
    try {
      const res = await axios.get("/getallrooms");
      setRooms(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadAllUsers = async () => {
    try {
      const res = await axios.get("/getallusers");
      setUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // cancel booking function
  const handleCancelBooking = async (bookingid, roomid) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.post("/cancelbooking", { bookingid, roomid });
      alert("Booking cancelled successfully");
      loadAllBookings();
    } catch (e) {
      console.log(e);
      alert("Error cancelling booking");
    }
  };

  // add room submit
  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomNumber || !rent || !description) {
      alert("Please fill in Room Number, Rent, and Description!");
      return;
    }

    const photos = [];
    if (image1) photos.push(image1);
    if (image2) photos.push(image2);
    if (image3) photos.push(image3);
    if (photos.length === 0) {
      photos.push("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
    }

    const newRoomData = {
      roomNumber: Number(roomNumber),
      count: Number(capacity || 1),
      rent: Number(rent),
      type: roomType,
      photos: photos,
      description: description,
      currentbooking: []
    };

    try {
      // calling addroom api
      await axios.post("/addroom", newRoomData);
      alert("Room added successfully!");

      // clear form
      setRoomNumber("");
      setCapacity("");
      setRent("");
      setImage1("");
      setImage2("");
      setImage3("");
      setDescription("");

      // refresh rooms and switch to ALL ROOMS tab
      loadAllRooms();
      setActiveTab("rooms");
    } catch (err) {
      console.log(err);
      alert("Failed to add room");
    }
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* Tab Navigation matching MDBTabs */}
      <div style={{ display: "flex", gap: "36px", borderBottom: "2px solid #e5e7eb", marginBottom: "30px", paddingLeft: "10px" }}>
        <button
          onClick={() => setActiveTab("bookings")}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "10px 0",
            cursor: "pointer",
            color: activeTab === "bookings" ? "#2e72d2" : "#666",
            borderBottom: activeTab === "bookings" ? "2px solid #2e72d2" : "none",
            marginBottom: "-2px",
            letterSpacing: "0.5px"
          }}
        >
          ALL BOOKINGS
        </button>

        <button
          onClick={() => setActiveTab("rooms")}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "10px 0",
            cursor: "pointer",
            color: activeTab === "rooms" ? "#2e72d2" : "#666",
            borderBottom: activeTab === "rooms" ? "2px solid #2e72d2" : "none",
            marginBottom: "-2px",
            letterSpacing: "0.5px"
          }}
        >
          ALL ROOMS
        </button>

        <button
          onClick={() => setActiveTab("addroom")}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "10px 0",
            cursor: "pointer",
            color: activeTab === "addroom" ? "#2e72d2" : "#666",
            borderBottom: activeTab === "addroom" ? "2px solid #2e72d2" : "none",
            marginBottom: "-2px",
            letterSpacing: "0.5px"
          }}
        >
          ADD ROOM
        </button>

        <button
          onClick={() => setActiveTab("users")}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "10px 0",
            cursor: "pointer",
            color: activeTab === "users" ? "#2e72d2" : "#666",
            borderBottom: activeTab === "users" ? "2px solid #2e72d2" : "none",
            marginBottom: "-2px",
            letterSpacing: "0.5px"
          }}
        >
          ALL USER
        </button>
      </div>

      {/* ---------------- TAB 1: ALL BOOKINGS ---------------- */}
      {activeTab === "bookings" && (
        <div>
          <h2 style={{ textAlign: "center", color: "#333", marginBottom: "36px", fontSize: "28px", fontWeight: "normal" }}>
            My Bookings
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "24px" }}>
            {bookings.map((booking) => {
              const isCancelled = booking.status === "cancelled";
              return (
                <div
                  key={booking._id}
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "600", color: "#222" }}>
                        {booking.type || "Delux Room"}
                      </span>
                      <span
                        style={{
                          background: isCancelled ? "#dc3545" : "#198754",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          textTransform: "uppercase"
                        }}
                      >
                        {booking.status || "BOOKED"}
                      </span>
                    </div>

                    <div style={{ fontSize: "14px", color: "#444", lineHeight: "1.8" }}>
                      <div>
                        <strong>Booking ID: </strong> {booking._id}
                      </div>
                      <div>
                        <strong>From: </strong> {booking.fromdate} &nbsp;|&nbsp; <strong>To: </strong> {booking.todate}
                      </div>
                      <div>
                        <strong>Total Amount: </strong> ₹{booking.totalAmount}
                      </div>
                      <div>
                        <strong>Customer Phone: </strong> {booking.phone}
                      </div>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div style={{ marginTop: "20px" }}>
                      <button
                        onClick={() => handleCancelBooking(booking._id, booking.roomid)}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "1px solid #e03131",
                          color: "#e03131",
                          borderRadius: "20px",
                          padding: "8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          letterSpacing: "0.5px"
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "36px", fontSize: "15px", fontWeight: "bold", color: "#333" }}>
            Total Bookings: {bookings.length}
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: ALL ROOMS ---------------- */}
      {activeTab === "rooms" && (
        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {/* Blue header bar matching screenshot */}
          <div style={{ background: "#3474d4", color: "white", textAlign: "center", padding: "18px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "normal" }}>Hotel Room Booking History</h2>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>Total Rooms: {rooms.length}</div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "14px 16px", color: "#333" }}>Room ID</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Room Number</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Capacity</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Rent / Day</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Type</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                  <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: "bold" }}>{room._id}</td>
                  <td style={{ padding: "14px 16px" }}>{room.roomNumber}</td>
                  <td style={{ padding: "14px 16px" }}>{room.count}</td>
                  <td style={{ padding: "14px 16px" }}>₹ {room.rent}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: room.type.toLowerCase().includes("non") ? "#6c757d" : "#198754",
                        color: "white",
                        padding: "3px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold"
                      }}
                    >
                      {room.type}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#555" }}>{room.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- TAB 3: ADD ROOM ---------------- */}
      {activeTab === "addroom" && (
        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", maxWidth: "800px", margin: "0 auto", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {/* Blue header bar matching screenshot */}
          <div style={{ background: "#3474d4", color: "white", textAlign: "center", padding: "18px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "normal" }}>Add a New Room</h2>
          </div>

          <form onSubmit={handleAddRoom} style={{ padding: "30px 40px" }}>
            {/* Top 3 inputs row */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px" }}>
                  Room Number
                </label>
                <input
                  type="number"
                  placeholder="Room Number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px" }}>
                  Max. Capacity
                </label>
                <input
                  type="number"
                  placeholder="No. of people"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px" }}>
                  Room Rent
                </label>
                <input
                  type="number"
                  placeholder="Rent per day"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            {/* Room Photos inputs */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                Room Photos
              </label>
              <input
                type="text"
                placeholder="Image 1 URL"
                value={image1}
                onChange={(e) => setImage1(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", marginBottom: "10px" }}
              />
              <input
                type="text"
                placeholder="Image 2 URL"
                value={image2}
                onChange={(e) => setImage2(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", marginBottom: "10px" }}
              />
              <input
                type="text"
                placeholder="Image 3 URL"
                value={image3}
                onChange={(e) => setImage3(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>

            {/* Room Type radio buttons */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                Room Type
              </label>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <label style={{ fontSize: "14px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="roomType"
                    value="Delux"
                    checked={roomType === "Delux"}
                    onChange={(e) => setRoomType(e.target.value)}
                  />{" "}
                  Delux
                </label>
                <label style={{ fontSize: "14px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="roomType"
                    value="Non-Delux"
                    checked={roomType === "Non-Delux"}
                    onChange={(e) => setRoomType(e.target.value)}
                  />{" "}
                  Non-Delux
                </label>
              </div>
            </div>

            {/* Room Description textarea */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                Room Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                required
              />
            </div>

            {/* Blue ADD ROOM button */}
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "#2e72d2",
                  color: "white",
                  border: "none",
                  padding: "10px 36px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.5px"
                }}
              >
                ADD ROOM
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------- TAB 4: ALL USER ---------------- */}
      {activeTab === "users" && (
        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {/* Dark header bar matching screenshot */}
          <div style={{ background: "#2e2929", color: "white", textAlign: "center", padding: "18px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "normal" }}>All Registered Users</h2>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>Total Users: {users.length}</div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "14px 16px", color: "#333" }}>User ID</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Name</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Email</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Phone</th>
                <th style={{ padding: "14px 16px", color: "#333" }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                  <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: "bold" }}>{u._id}</td>
                  <td style={{ padding: "14px 16px" }}>{u.name}</td>
                  <td style={{ padding: "14px 16px" }}>{u.email}</td>
                  <td style={{ padding: "14px 16px" }}>{u.phone}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: u.userType === "Admin" ? "#198754" : "#2e72d2",
                        color: "white",
                        padding: "3px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "bold"
                      }}
                    >
                      {u.userType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
