import { CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { LOGIN_API } from "../../../constants/Constants";
import { FaBusAlt } from "react-icons/fa";

import React, { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(userDetails, "details");

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data, "data");
      if (data.status === 200) {
        setTimeout(() => {
          localStorage.setItem("token", data.token);
          //   localStorage.setItem("orgName", data.organisation_name);
          //   localStorage.setItem("adminName", data.admin_name);
          //   localStorage.setItem("orgId", data.org_id);
          setLoading(false);
          setResponseData(data);
          navigate("/");
        }, 1000);
      } else {
        setResponseData(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleLoginSubmit}>
        <div className="org-container">
          <div className="bg-icon">
            <CiLock style={{ color: "#ffffff", fontSize: "1.2rem" }} />
          </div>
          <h2>Sign In</h2>
          <p>Manage your organization efficiently</p>
        </div>

        <div className="form-controll">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter company email"
            name="email"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-controll">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter company password"
            name="password"
            onChange={handleInputChange}
          />
        </div>
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
            "Sign In"
          )}{" "}
        </button>
        <span className="span-text">
          Don't have an account?{" "}
          <a className="sign-in" onClick={() => navigate("/register")}>
            Sign Up
          </a>{" "}
        </span>
      </form>
    </div>
  );
};

export default Login;
