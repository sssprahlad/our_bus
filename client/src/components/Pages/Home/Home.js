import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { GET_BUSES_API, SEARCH_BUSES_API } from "../../../constants/Constants";
import { busDrops } from "../../../utils/PickAndDrop";
import "./Home.css";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ModelPopUp from "../ModelPopUp/ModelPopUp";

const Home = () => {
  const [busDetails, setBusDetails] = useState();
  const [searchBuses, setSearchBuses] = useState({
    fromCity: "",
    toCity: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [popUp, setPopUp] = useState(false);
  const [selectedBusDetails, setSelectedBusDetails] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchBuses({
      ...searchBuses,
      [name]: value,
    });
  };

  const handleSearchBuses = async () => {
    setLoading(true);

    const params = new URLSearchParams(searchBuses).toString();
    // fetch(`${SEARCH_BUSES_API}?${params}`

    const response = await fetch(`${SEARCH_BUSES_API}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // body: JSON.stringify(searchBuses),
    });

    const data = await response.json();
    console.log(data, "search buses data");
    if (data?.status === 200) {
      setLoading(false);
      setBusDetails(data?.buses);
    }
  };
  const today = new Date().toISOString().split("T")[0];

  console.log(busDetails, "bus details");
  console.log(searchBuses, "seachBuses");
  console.log(popUp, "popup");

  return (
    <div className="main-container">
      <Navbar />
      <div className="search-container">
        <select
          className="search-container-select"
          value={searchBuses?.fromCity}
          name="fromCity"
          onChange={handleInputChange}
        >
          <option>From</option>
          {busDrops?.map((eachDetails) => (
            <option
              key={eachDetails?.city}
              value={eachDetails.city.toLowerCase()}
            >
              {eachDetails?.city}
            </option>
          ))}
        </select>

        <select
          className="search-container-select"
          value={searchBuses?.toCity}
          name="toCity"
          onChange={handleInputChange}
        >
          <option>To</option>
          {busDrops?.map((eachDetails) => (
            <option
              key={eachDetails?.city}
              value={eachDetails.city.toLowerCase()}
            >
              {eachDetails?.city}
            </option>
          ))}
        </select>
        <input
          className="search-container-select"
          type="date"
          name="date"
          min={today}
          onChange={handleInputChange}
        />

        <button className="search-btn" onClick={handleSearchBuses}>
          {loading ? <div className="spinner"></div> : "Search"}
        </button>
      </div>
      <div className="main-sub-container">
        {/* <div className="search-container">
        
          <select
            value={searchBuses?.fromCity}
            name="fromCity"
            onChange={handleInputChange}
          >
            <option>From</option>
            {busDrops?.map((eachDetails) => (
              <option
                key={eachDetails?.city}
                value={eachDetails.city.toLowerCase()}
              >
                {eachDetails?.city}
              </option>
            ))}
          </select>

          <select
            value={searchBuses?.toCity}
            name="toCity"
            onChange={handleInputChange}
          >
            <option>To</option>
            {busDrops?.map((eachDetails) => (
              <option
                key={eachDetails?.city}
                value={eachDetails.city.toLowerCase()}
              >
                {eachDetails?.city}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            min={today}
            onChange={handleInputChange}
          />
         
          <button className="search-btn" onClick={handleSearchBuses}>
            Search
          </button>
        </div> */}
        <div className="bus-details-main-container">
          {busDetails?.length === 0 ? (
            <h3 style={{ textAlign: "center" }}>No Buses Found</h3>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {busDetails?.map((eachBus) => {
                const ratingsData = [
                  { rating: 4.7, persons: 520 },
                  { rating: 4.3, persons: 310 },
                  { rating: 3.9, persons: 150 },
                  { rating: 4.8, persons: 780 },
                  { rating: 3.6, persons: 220 },
                  { rating: 4.1, persons: 405 },
                  { rating: 2.9, persons: 90 },
                  { rating: 5.0, persons: 1020 },
                  { rating: 3.4, persons: 343 },
                  { rating: 4.6, persons: 610 },
                ];

                const ratings =
                  ratingsData[Math.floor(Math.random() * ratingsData.length)];

                return (
                  <div>
                    <div className="bus-container" key={eachBus?.id}>
                      <div className="bus-cart-1">
                        <h3 className="bus-name">{eachBus?.bus_name}</h3>
                        <h4 className="bus-type">
                          {eachBus?.bus_type === "mixed"
                            ? "Sleeper, 2 + 1 Seater"
                            : eachBus?.bus_type}
                        </h4>
                      </div>

                      <div className="bus-cart-2">
                        <div className="rating-container">
                          <div className="rating-btn">
                            <FaStar style={{ color: "white" }} />
                            <p>{ratings?.rating}</p>
                          </div>
                          <p>{ratings?.persons}</p>
                        </div>

                        <div className="boarding-duration-container">
                          <div className="boarding-container">
                            <p className="pickup-point">
                              {eachBus?.departure_time}
                            </p>{" "}
                            <FaMinus style={{ color: "lightgray" }} />
                            <p className="droping-point">
                              {eachBus?.arrival_time}
                            </p>
                          </div>
                          <div className="duration-container">
                            {eachBus?.duration}
                          </div>
                        </div>
                      </div>

                      <div className="bus-cart-3">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FaRupeeSign
                              style={{
                                fontSize: "1.1rem",
                                marginBottom: "-2px",
                              }}
                            />
                            <p className="price">{eachBus?.seat_price}</p>
                          </div>

                          <button
                            className="view-seats-btn"
                            onClick={() => {
                              setPopUp(true);
                              setSelectedBusDetails(eachBus);
                            }}
                          >
                            View seats
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <div className="mobile-card-view"> */}
                    <div
                      className="mobile-card"
                      key={eachBus?.id}
                      onClick={() => {
                        setPopUp(true);
                        setSelectedBusDetails(eachBus);
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div className="boarding-container">
                          <p className="pickup-point">
                            {eachBus?.departure_time}
                          </p>{" "}
                          <FaMinus style={{ color: "lightgray" }} />
                          <p className="droping-point">
                            {eachBus?.arrival_time}
                          </p>
                        </div>
                        <div className="bus-cart">
                          <h3 className="bus-name">{eachBus?.bus_name}</h3>
                          <h4 className="bus-type">
                            {" "}
                            {eachBus?.bus_type === "mixed"
                              ? "Sleeper, 2 + 1 Seater"
                              : eachBus?.bus_type}
                          </h4>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div className="rating-container">
                          <div className="rating-btn">
                            <FaStar style={{ color: "white" }} />
                            <p>{ratings?.rating}</p>
                          </div>
                          <p>{ratings?.persons}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FaRupeeSign
                            style={{ fontSize: "1.1rem", marginBottom: "-2px" }}
                          />
                          <p className="price">{eachBus?.seat_price}</p>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {popUp && (
        <ModelPopUp
          searchBuses={searchBuses}
          setPopUp={setPopUp}
          busDetails={busDetails}
          selectedBusDetails={selectedBusDetails}
        />
      )}
    </div>
  );
};

export default Home;
