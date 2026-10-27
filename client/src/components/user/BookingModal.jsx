import React, { useState } from "react";
import { bookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function BookingModal({ room, onClose, onSuccess }) {
  const { user } = useAuth();

  // Default dates: tomorrow and day after tomorrow in DD-MM-YYYY format
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
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone ? String(user.phone) : "");

  const [cardDetails, setCardDetails] = useState({
    cardholdername: user?.name || "Guest User",
    cardnumber: "4111222233334444",
    cvvcode: "123",
    expmonthyear: "12/28"
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        userid: user?._id,
        username: guestName,
        fromdate: fromDate,
        todate: toDate,
        totalAmount: totalAmount,
        totaldays: totalDays,
        phone: Number(guestPhone) || 9704927807,
        cardDetails
      };

      await bookingAPI.bookRoom(payload);
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Failed to complete reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">
          ✕
        </button>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
          Book {room.type} Room #{room.roomNumber}
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
          Rate: ₹{room.rent} / night • Capacity: {room.count} Guests
        </p>

        {errorMsg && <div className="alert-box alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                Check-in Date (DD-MM-YYYY)
              </label>
              <input
                type="text"
                className="form-control"
                value={fromDate}
                onChange={(e) => handleDateChange(e.target.value, toDate)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                Check-out Date (DD-MM-YYYY)
              </label>
              <input
                type="text"
                className="form-control"
                value={toDate}
                onChange={(e) => handleDateChange(fromDate, e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                Guest Name
              </label>
              <input
                type="text"
                className="form-control"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                Contact Phone
              </label>
              <input
                type="tel"
                className="form-control"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Pricing summary */}
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              padding: "12px 16px",
              marginBottom: 20
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
              <span>Duration:</span>
              <strong>{totalDays} {totalDays === 1 ? "Night" : "Nights"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
              <span>Price per night:</span>
              <span>₹{room.rent}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                fontWeight: 700,
                color: "#1e3a8a",
                borderTop: "1px solid #dbeafe",
                paddingTop: 6,
                marginTop: 6
              }}
            >
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Card Details */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
              Secure Payment Info (CardDetails)
            </h3>

            <div className="form-group">
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                Cardholder Name
              </label>
              <input
                type="text"
                className="form-control"
                value={cardDetails.cardholdername}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardholdername: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                Card Number
              </label>
              <input
                type="text"
                className="form-control"
                value={cardDetails.cardnumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardnumber: e.target.value })
                }
                placeholder="4111 2222 3333 4444"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                  Exp Month/Year
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  value={cardDetails.expmonthyear}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expmonthyear: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4, display: "block" }}>
                  CVV Code
                </label>
                <input
                  type="password"
                  maxLength="4"
                  className="form-control"
                  placeholder="123"
                  value={cardDetails.cvvcode}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvvcode: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit-blue" disabled={loading}>
            {loading ? "PROCESSING PAYMENT..." : `PAY ₹${totalAmount} & CONFIRM BOOKING`}
          </button>
        </form>
      </div>
    </div>
  );
}
