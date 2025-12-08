import React from "react";
import { MdAccountCircle } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <div className="nav-left-part">
        <img src="/images/bus-logo.png" className="logo" />
        <ul className="image-containers">
          <li className="nav-link">
            <img
              src="/images/bus-tickets-page.svg"
              alt="bus-img"
              className="bus-img"
            />
          </li>
          <li className="nav-link">
            <img
              src="/images/train-tickets-page.svg"
              alt="train-img"
              className="train-img"
            />
          </li>
        </ul>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <div className="row-container">
          <IoIosHelpCircleOutline style={{ height: "25px", width: "25px" }} />
          <h3>Help</h3>
        </div>
        <div className="row-container">
          <MdAccountCircle style={{ height: "25px", width: "25px" }} />
          <h3>Account</h3>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
