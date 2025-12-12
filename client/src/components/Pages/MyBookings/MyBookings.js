import React, { useEffect, useState } from "react";
import "./MyBookings.css";
import { MY_BOOKINGS } from "../../../constants/Constants";
import Navbar from "../Navbar/Navbar";
import { Calendar, User, Phone, MapPin, Armchair, Bus } from "lucide-react";

const MyBookings = () => {
  const [myBookings, setMyBookings] = useState();
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async () => {
    setLoading(true);
    const response = await fetch(`${MY_BOOKINGS}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log(data, "my bookings");

    if (data.status === 200) {
      setLoading(false);
      setMyBookings(data?.myBookings);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const [filterDate, setFilterDate] = useState("all");
  const [filterSeatType, setFilterSeatType] = useState("all");

  const filteredBookings = myBookings?.filter((booking) => {
    const dateMatch =
      filterDate === "all" || booking.travel_date === filterDate;
    const seatMatch =
      filterSeatType === "all" || booking.seat_type === filterSeatType;
    return dateMatch && seatMatch;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const uniqueDates = [...new Set(myBookings?.map((b) => b.travel_date))];

  return (
    <div>
      <Navbar />
      <div className="my-booking-container">
        <div className="page-container">
          <div className="header-section">
            <h1>My Booking Tickets</h1>
            <p>Manage and view all your bus reservations</p>
          </div>

          <div className="filter-container">
            <div className="filter-box">
              <label>Filter by Date</label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Dates</option>
                {uniqueDates?.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-box">
              <label>Filter by Seat Type</label>
              <select
                value={filterSeatType}
                onChange={(e) => setFilterSeatType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="seater">Seater</option>
                <option value="sleeper">Sleeper</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                class="spinner"
                style={{ height: "35px", width: "35px" }}
              ></div>
            </div>
          ) : (
            <div className="booking-list">
              {filteredBookings?.map((booking) => (
                <div key={booking.booking_id} className="booking-card">
                  <div className="left-section">
                    <div className="bus-title">
                      <Bus className="icon" />
                      <span>{booking.bus_name}</span>
                    </div>

                    <div className="date-row">
                      <Calendar className="icon" />
                      <span>{formatDate(booking.travel_date)}</span>
                    </div>

                    <div className="route">
                      <div className="point">
                        <MapPin className="icon" />
                        <div>
                          <p className="label">Boarding Point</p>
                          <p>{booking.boarding_point}</p>
                        </div>
                      </div>

                      <div className="line"></div>

                      <div className="point">
                        <MapPin className="icon" />
                        <div>
                          <p className="label">Dropping Point</p>
                          <p>{booking.droping_point}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="right-section">
                    <div className="user-info">
                      <div className="user-left">
                        <div className="user-icon">
                          <User />
                        </div>
                        <div>
                          <h3>{booking.user_name}</h3>
                          <p>
                            {booking.gender}, {booking.age} years
                          </p>
                        </div>
                      </div>

                      <div className="seat-type">
                        {booking.seat_type.toUpperCase()}
                      </div>
                    </div>

                    <div className="details-grid">
                      <div className="detail-item">
                        <Phone className="icon-sm" />
                        <div>
                          <p className="label-sm">Phone</p>
                          <p>{booking.phone_number}</p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <Armchair className="icon-sm" />
                        <div>
                          <p className="label-sm">Seat Number</p>
                          <p>#{booking.seat_number}</p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <div className="id-icon">ID</div>
                        <div>
                          <p className="label-sm">Booking ID</p>
                          <p>#{booking.booking_id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBookings?.length === 0 && (
                <div className="no-data">
                  No bookings found matching your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
