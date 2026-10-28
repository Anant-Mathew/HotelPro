// ==========================================
// BOOKING MODAL COMPONENT
// ==========================================
import React, { useState } from "react";
import axios from "axios";

export default function BookingModal({ room, onClose, onSuccess }) {
  // get user from localStorage
  let user = {};
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    user = {};
  }

  // Default dates: tomorrow and day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const formatDate = (d) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [fromDate, setFromDate] = useState(formatDate(tomorrow));
  const [toDate, setToDate] = useState(formatDate(dayAfter));
  const [totalDays, setTotalDays] = useState(1);
  const [guestName, setGuestName] = useState(user.name || "");
  const [guestPhone, setGuestPhone] = useState(user.phone ? String(user.phone) : "");

  const [cardDetails, setCardDetails] = useState({
    cardholdername: user.name || "Guest User",
    cardnumber: "4111222233334444",
    cvvcode: "123",
    expmonthyear: "12/28"
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // calculate number of days between two dates
  const calculateDays = (fromStr, toStr) => {
    try {
      const [fD, fM, fY] = fromStr.split("-").map(Number);
      const [tD, tM, tY] = toStr.split("-").map(Number);
      const fDate = new Date(fY, fM - 1, fD);
      const tDate = new Date(tY, tM - 1, tD);
      const diffTime = tDate.getTime() - fDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const handleDateChange = (from, to) => {
    setFromDate(from);
    setToDate(to);
    setTotalDays(calculateDays(from, to));
  };

  const totalAmount = totalDays * room.rent;

  // submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!guestName || !guestPhone || !fromDate || !toDate) {
      setErrorMsg("Please complete all personal and stay details.");
      return;
    }

    if (!cardDetails.cardnumber || !cardDetails.cvvcode || !cardDetails.expmonthyear) {
      setErrorMsg("Please complete payment card details.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        room: {
          _id: room._id,
          roomNumber: room.roomNumber,
          type: room.type,
          rent: room.rent
        },
        roomid: room._id,
        type: `${room.type} Room`,
        userid: user._id,
        username: guestName,
        fromdate: fromDate,
        todate: toDate,
        totalAmount: totalAmount,
        totaldays: totalDays,
        phone: Number(guestPhone) || 9704927807,
        cardDetails
      };

      await axios.post("/bookroom", payload);
      alert("Room booked successfully!");
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
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
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          position: "relative"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "14px",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#666"
          }}
        >
          ✕
        </button>

        <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", color: "#1e293b" }}>
          Book {room.type} Room #{room.roomNumber}
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
          Rate: ₹{room.rent} / night • Capacity: {room.count} Guests
        </p>

        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              padding: "10px 14px",
              borderRadius: "4px",
              fontSize: "14px",
              marginBottom: "14px"
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Dates */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px", color: "#555" }}>
                Check-in (DD-MM-YYYY)
              </label>
              <input
                type="text"
                value={fromDate}
                onChange={(e) => handleDateChange(e.target.value, toDate)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px", color: "#555" }}>
                Check-out (DD-MM-YYYY)
              </label>
              <input
                type="text"
                value={toDate}
                onChange={(e) => handleDateChange(fromDate, e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                required
              />
            </div>
          </div>

          {/* Price summary */}
          <div
            style={{
              background: "#f0f7ff",
              border: "1px solid #bfdbfe",
              padding: "10px 14px",
              borderRadius: "4px",
              marginBottom: "12px",
              fontSize: "13px"
            }}
          >
            <div>Duration: <strong>{totalDays} {totalDays === 1 ? "Night" : "Nights"}</strong></div>
            <div>Price per night: ₹{room.rent}</div>
            <div style={{ fontWeight: "bold", color: "#1e3a8a", marginTop: "4px", fontSize: "15px" }}>
              Total: ₹{totalAmount}
            </div>
          </div>

          {/* Guest info */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px", color: "#555" }}>
              Guest Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px", color: "#555" }}>
              Contact Phone
            </label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              required
            />
          </div>

          {/* Payment info */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginBottom: "12px" }}>
            <div style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "10px", color: "#333" }}>
              Payment Card Details
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardDetails.cardholdername}
              onChange={(e) => setCardDetails({ ...cardDetails, cardholdername: e.target.value })}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", marginBottom: "8px" }}
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardnumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardnumber: e.target.value })}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", marginBottom: "8px" }}
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expmonthyear}
                onChange={(e) => setCardDetails({ ...cardDetails, expmonthyear: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                required
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength="4"
                value={cardDetails.cvvcode}
                onChange={(e) => setCardDetails({ ...cardDetails, cvvcode: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#2e72d2",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            {loading ? "PROCESSING..." : `PAY ₹${totalAmount} & CONFIRM BOOKING`}
          </button>
        </form>
      </div>
    </div>
  );
}
