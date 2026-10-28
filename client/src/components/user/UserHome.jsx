// ==========================================
// USER DASHBOARD (USERHOME)
// ==========================================
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserHome() {
  // state variables
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // booking form state
  const [fromDate, setFromDate] = useState("2025-09-24");
  const [toDate, setToDate] = useState("2025-09-26");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("4111222233334444");
  const [cvv, setCvv] = useState("123");
  const [expDate, setExpDate] = useState("12/28");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  let user = {};
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    user = {};
  }

  // fetch all rooms when page loads
  useEffect(() => {
    fetchRooms();
    if (user.name) {
      setCardHolder(user.name);
    }
    if (user.phone) {
      setPhone(user.phone);
    }
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/getallrooms");
      console.log("Rooms data:", res.data);
      setRooms(res.data);
    } catch (error) {
      console.log("Error loading rooms:", error);
    }
  };

  // calculate total days between fromdate and todate
  const calculateDays = () => {
    try {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch (e) {
      return 1;
    }
  };

  const totalDays = calculateDays();
  const totalAmount = selectedRoom ? totalDays * selectedRoom.rent : 0;

  // open modal for booking
  const handleLearnMore = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  // function to submit booking
  const handleBookRoom = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !cardNumber || !cvv || !cardHolder) {
      alert("Please fill in all booking and payment details!");
      return;
    }

    const bookingData = {
      room: selectedRoom,
      roomid: selectedRoom._id,
      type: `${selectedRoom.type} Room`,
      userid: user._id,
      username: user.name || "Customer",
      fromdate: fromDate,
      todate: toDate,
      totalAmount: totalAmount,
      totaldays: totalDays,
      phone: Number(phone) || 9704927800,
      cardDetails: {
        cardholdername: cardHolder,
        cardnumber: cardNumber,
        cvvcode: cvv,
        expmonthyear: expDate
      }
    };

    try {
      // call bookroom api
      const response = await axios.post("/bookroom", bookingData);
      console.log("Booking response:", response.data);
      alert("Room booked successfully!");
      setShowModal(false);
      navigate("/mybookings");
    } catch (error) {
      console.log(error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "30px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* List of rooms */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        {rooms.map((room) => (
          <div
            key={room._id}
            style={{
              width: "280px",
              background: "#ffffff",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              fontFamily: "sans-serif"
            }}
          >
            {/* Room Image */}
            <img
              src={
                room.photos && room.photos[0]
                  ? room.photos[0]
                  : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
              }
              alt="Room"
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />

            {/* Room Card Body (matches screenshot exactly) */}
            <div style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>
                Room Type: {room.type}
              </h3>

              <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>
                <div>Room Capacity: {room.count} People</div>
                <div>Rent: {room.rent} per day</div>
                <div>Type: {room.type}</div>
                <div>Description: {room.description}</div>
              </div>

              {/* Blue Learn More Button (matches screenshot) */}
              <button
                onClick={() => handleLearnMore(room)}
                style={{
                  backgroundColor: "#2e72d2",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.5px"
                }}
              >
                LEARN MORE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal Popup */}
      {showModal && selectedRoom && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "6px",
              width: "90%",
              maxWidth: "460px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>
                Book {selectedRoom.type} Room #{selectedRoom.roomNumber}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookRoom}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                  Check-in Date:
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                  Check-out Date:
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                  required
                />
              </div>

              {/* Price Calculation Box */}
              <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px" }}>
                <div>Price per day: ₹{selectedRoom.rent}</div>
                <div>Total Days: {totalDays}</div>
                <div style={{ fontWeight: "bold", color: "#2e72d2", marginTop: "4px" }}>
                  Total Amount: ₹{totalAmount}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                  Customer Phone:
                </label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile number"
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                  required
                />
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: "12px", marginTop: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "8px" }}>Payment Card Details:</div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginBottom: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                  required
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginBottom: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                  required
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    style={{ flex: 1, padding: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    style={{ flex: 1, padding: "8px", boxSizing: "border-box", border: "1px solid #ccc" }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#2e72d2",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                PAY & BOOK NOW (₹{totalAmount})
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
