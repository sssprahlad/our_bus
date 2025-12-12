import React from "react";
import "./Contact.css";
import Navbar from "../Navbar/Navbar";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div
        className="main-container"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <h3>Contact</h3>
      </div>
    </div>
  );
};

export default Contact;
