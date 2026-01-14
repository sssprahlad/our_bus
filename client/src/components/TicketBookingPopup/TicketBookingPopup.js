import { useState } from "react";
import "./TicketBookingPopup.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Pages/Navbar/Navbar";

const TicketBookingPopup = () => {
  const navigate = useNavigate();
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsBookingConfirmed(true);

      setTimeout(() => {
        setIsBookingConfirmed(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div>
      <Navbar />
      <div className="ticket-booking-container">
        <h1>Ticket Status</h1>

        {/* {!isBookingConfirmed ? (
        <div className="booking-form">
          <div className="form-group">
            <label>Passenger Name</label>
            <input type="text" placeholder="Enter passenger name" />
          </div>

          <button
            onClick={handleBooking}
            disabled={isLoading}
            className="book-now-btn"
          >
            {isLoading ? "Processing..." : "Book Now"}
          </button>
        </div>
      ) : ( */}
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your ticket has been booked successfully.</p>
          <p>Thank you for choosing our service!</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="book-now-btn"
          >
            My Bookings
          </button>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default TicketBookingPopup;
