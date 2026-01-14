import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRouter from "./constants/ProtectedRouter";
import "./App.css";
import Login from "./components/UserDetails/Login/Login";
import Register from "./components/UserDetails/Register/Register";
import Home from "./components/Pages/Home/Home";
import MyBookings from "./components/Pages/MyBookings/MyBookings";
import Account from "./components/Pages/Account/Account";
import Contact from "./components/Pages/Contact/Contact";
import Help from "./components/Pages/Help/Help";
import TicketBookingPopup from "./components/TicketBookingPopup/TicketBookingPopup";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-account" element={<Account />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route
              path="/ticket-booking-popup"
              element={<TicketBookingPopup />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
