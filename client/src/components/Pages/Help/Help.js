import React from "react";
import "./Help.css";
import Navbar from "../Navbar/Navbar";

const Help = () => {
  return (
    <div>
        <Navbar/>
      <div className="main-container"  style={{ textAlign: "center", padding: "2rem" }}>
        <h3>Help</h3>
      </div>
    </div>
  );
};

export default Help;
