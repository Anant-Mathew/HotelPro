// ==========================================
// USER BOOKINGS HISTORY COMPONENT
// ==========================================
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // fetch user bookings when component mounts
  useEffect(() => {
    if (user._id) {
      fetchMyBookings();
    }
  }, []);

  const fetchMyBookings = async () => {
    try {
      // calling getbookingsbyuserid api
      const res = await axios.post("/getbookingsbyuserid", { userid: user._id });
      console.log("My bookings:", res.data);
      setBookings(res.data);
    } catch (error) {
      console.log("Error loading bookings:", error);
    }
  };

  // cancel booking function
  const handleCancelBooking = async (bookingid, roomid) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) {
      return;
    }

    try {
      const res = await axios.post("/cancelbooking", {
        bookingid: bookingid,
        roomid: roomid
      });
      alert("Booking cancelled successfully");
      fetchMyBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "980px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "36px", fontSize: "28px", fontWeight: "normal" }}>
        My Bookings
      </h2>

      {/* Grid of booking cards matching screenshot */}
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
                {/* Header with Room title and status badge */}
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

                {/* Booking details */}
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

              {/* Cancel button matching screenshot outline red pill */}
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

      {/* Total Bookings counter at bottom */}
      <div style={{ textAlign: "center", marginTop: "36px", fontSize: "15px", fontWeight: "bold", color: "#333" }}>
        Total Bookings: {bookings.length}
      </div>
    </div>
  );
}
