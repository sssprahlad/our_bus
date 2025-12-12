import React from "react";
import "./Account.css";
import Navbar from "../Navbar/Navbar";

const Account = () => {
  return (
    <div>
      <Navbar />
      <div
        className="main-container"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <h3>Account</h3>
      </div>
    </div>
  );
};

export default Account;
