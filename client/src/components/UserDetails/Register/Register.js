import React from "react";
import { LuBuilding2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { REGISTER_API } from "../../../constants/Constants";
import { FaBusAlt } from "react-icons/fa";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    userName: "",
    email: "",
    passsword: "",
  });
  const [responseData, setResponseData] = useState();
  const [loading, setLoading] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(register, " register details");

    try {
      const response = await fetch(REGISTER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data, "data");
      if (data.status === 200) {
        setResponseData(data);
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setLoading(false);
        setResponseData(data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleRegister}>
        <div className="org-container">
          <div className="bg-icon">
            {/* <FaBusAlt style={{ color: "#ffffff", fontSize: "1.2rem" }} /> */}
            <img
              src="/images/bus-logo.png"
              alt="logo"
              style={{ height: "50px", width: "50px" }}
            />
          </div>
          <h2>Register</h2>
          {/* <p>Manage your organization efficiently</p> */}
        </div>
        <div className="form-controll">
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            placeholder="Enter user name"
            name="userName"
            onChange={handleRegisterChange}
            required
          />
        </div>

        <div className="form-controll">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            onChange={handleRegisterChange}
            required
          />
        </div>
        <div className="form-controll">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            name="password"
            onChange={handleRegisterChange}
            required
          />
        </div>
        {/* <button type="submit">Sign Up</button> */}
        <p
          style={{
            color: responseData?.status === 200 ? "green" : "red",
            textAlign: "center",
            fontSize: "0.75rem",
          }}
        >
          {responseData?.message}
        </p>
        <button type="submit">
          {" "}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                class="spinner"
                style={{ height: "25px", width: "25px" }}
              ></div>
            </div>
          ) : (
            "Sign Up"
          )}{" "}
        </button>
        <span className="span-text">
          Already have an account?{" "}
          <a className="sign-in" onClick={() => navigate("/login")}>
            Sign In
          </a>{" "}
        </span>
      </form>
    </div>
  );
};

export default Register;
