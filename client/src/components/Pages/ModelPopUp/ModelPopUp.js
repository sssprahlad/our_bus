import React, { useState, useEffect } from "react";
import "./ModelPopUp.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import { busDrops } from "../../../utils/PickAndDrop";
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoIosContact } from "react-icons/io";

import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ModelPopUp = ({
  searchBuses,
  setPopUp,
  busDetails,
  selectedBusDetails,
}) => {
  const [passengerDetails, setPassengerDetails] = useState({
    userName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    boardingPoint: "",
    droppingPoint: "",
    // test:""
  });
  const [selectedSeatsList, setSelectedSeatsList] = useState([]);

  const [tabs, setTabs] = useState({
    seatsTab: true,
    boardingTab: false,
    informTab: false,
  });

  const seatsData = [
    {
      id: 1,
      text: "Available",
      seat: "/images/seater_available.svg",
      sleeper: "/images/sl_available.svg",
    },
    {
      id: 2,
      text: "Available only for male passenger",
      seat: "/images/seater_male.svg",
      sleeper: "/images/sl_male.svg",
    },
    {
      id: 3,
      text: "Already booked",
      seat: "/images/seater_booked.svg",
      sleeper: "/images/sl_booked.svg",
    },
    {
      id: 4,
      text: "Selected by you",
      seat: "/images/seater_selected.svg",
      sleeper: "/images/sl_selected.svg",
    },
    {
      id: 5,
      text: "Available only for female passenger",
      seat: "/images/seater_fem.svg",
      sleeper: "/images/sl_fem.svg",
    },
    {
      id: 6,
      text: "Booked by female passenger",
      seat: "/images/seat-fem-blocked.webp",
      sleeper: "/images/pinkgreysleeper.webp",
    },
    {
      id: 7,
      text: "Booked by male passenger",
      seat: "/images/seat-male-blocked.svg",
      sleeper: "/images/bluegreysleeper.webp",
    },
  ];

  const [activeTab, setActiveTab] = useState("seats");

  const [seatList, setSeatList] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      selected: false,
    }))
  );

  const [sleeperList, setSleeperList] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      selected: false,
    }))
  );

  useEffect(() => {
    if (selectedBusDetails?.total_seats) {
      setSeatList(
        Array.from({ length: selectedBusDetails.total_seats }, (_, i) => ({
          id: i + 1,
          selected: false,
        }))
      );
    }

    if (selectedBusDetails?.total_sleeper) {
      setSleeperList(
        Array.from({ length: selectedBusDetails.total_sleeper }, (_, i) => ({
          id: i + 1,
          selected: false,
        }))
      );
    }
  }, [selectedBusDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPassengerDetails({ ...passengerDetails, [name]: value });
  };

  console.log(selectedSeatsList, "select seats");

  const boardingDropPointing = () => {
    const boardingData = busDrops.find(
      (eachPoint) =>
        eachPoint.city.toLowerCase() === searchBuses?.fromCity.toLowerCase()
    );

    const dropingData = busDrops.find(
      (eachPoint) =>
        eachPoint.city.toLowerCase() === searchBuses?.toCity.toLowerCase()
    );

    const handleRowClick = (bp, point) => {
      if (point === "boarding") {
        setPassengerDetails({
          ...passengerDetails,
          boardingPoint: bp.point,
        });
      } else {
        setPassengerDetails({
          ...passengerDetails,
          droppingPoint: bp.point,
        });
      }
    };

    console.log(passengerDetails, "passenger details");
    console.log(selectedBusDetails, "selected bus details");
    console.log(seatList, "seatsList");

    return (
      <div className="boarding-droping-main-container">
        <div className="boarding-point-container">
          <div className="boarding-details-cont">
            <h3>Boarding points</h3>
            <p className="drop-select-text">
              {passengerDetails?.boardingPoint}
            </p>
          </div>
          <div className="dropdown-list">
            {boardingData?.boarding_points?.map((bp, index) => (
              <div
                className="drop-point-container"
                key={index}
                onClick={() => handleRowClick(bp, "boarding")}
              >
                <div className="time-point-container">
                  <p>{bp.time}</p>
                  <p>{bp.point}</p>
                </div>
                <input
                  className="input-radio"
                  type="radio"
                  name="boardingPoint"
                  // onChange={handleInputChange}
                  checked={passengerDetails?.boardingPoint === bp.point}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="boarding-point-container">
          <div className="boarding-details-cont">
            <h3>Dropping points</h3>
            <p className="drop-select-text">
              {passengerDetails?.droppingPoint}
            </p>
          </div>
          <div className="dropdown-list">
            {dropingData?.dropping_points?.map((dp, index) => (
              <div
                className="drop-point-container"
                key={index}
                onClick={() => handleRowClick(dp, "dropping")}
              >
                <div className="time-point-container">
                  <p>{dp.time}</p>
                  <p>{dp.point}</p>
                </div>
                <input
                  className="input-radio"
                  type="radio"
                  name="droppingPoint"
                  //  onChange={handleInputChange}
                  checked={passengerDetails?.droppingPoint === dp.point}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const seatsAlignment = () => {
    const handleSeatClick = (seatId) => {
      setSeatList((prev) =>
        prev.map((s) => (s.id === seatId ? { ...s, selected: !s.selected } : s))
      );

      setSelectedSeatsList((prev) => {
        const exists = prev.find((x) => x.type === "seat" && x.id === seatId);

        if (exists) {
          return prev.filter((x) => !(x.type === "seat" && x.id === seatId));
        } else {
          return [...prev, { type: "seat", id: seatId }];
        }
      });
    };

    const handleSleeperClick = (sleeperId) => {
      setSleeperList((prev) =>
        prev.map((s) =>
          s.id === sleeperId ? { ...s, selected: !s.selected } : s
        )
      );

      setSelectedSeatsList((prev) => {
        const exists = prev.find(
          (x) => x.type === "sleeper" && x.id === sleeperId
        );

        if (exists) {
          return prev.filter(
            (x) => !(x.type === "sleeper" && x.id === sleeperId)
          );
        } else {
          return [...prev, { type: "sleeper", id: sleeperId }];
        }
      });
    };

    return (
      <div className="seats-main-container">
        <div className="seats-container">
          <div className="stearing-container">
            <h5>Lower deck</h5>
            <img src="/images/stearing.svg" alt="stearing" />
          </div>
          <div className="bus-seats-container">
            {Array.from({ length: Math.ceil(seatList.length / 3) }).map(
              (_, rowIndex) => {
                const startIndex = rowIndex * 3;
                const singleSeat = seatList[startIndex];
                const doubleSeats = seatList.slice(
                  startIndex + 1,
                  startIndex + 3
                );

                return (
                  <div className="seats-row-container" key={rowIndex}>
                    <div
                      className={`single-seats`}
                      //   ${
                      //   singleSeat.selected ? "selected" : ""
                      // }`}
                      onClick={() => handleSeatClick(singleSeat.id)}
                    >
                      {/* <p>Seat {singleSeat.id}</p> */}
                      <img
                        className="seat-size"
                        src={
                          singleSeat?.selected
                            ? "/images/seater_selected.svg"
                            : "/images/seater_available.svg"
                        }
                        alt="seat"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                        <p style={{ fontSize: "0.75rem" }}>200</p>
                      </div>
                    </div>

                    {/* Double seats */}
                    <div className="double-seats">
                      {doubleSeats.map((seat) => (
                        <div
                          key={seat.id}
                          className={`seat-box`}
                          //   ${
                          //   seat.selected ? "selected" : ""}`
                          // }
                          onClick={() => handleSeatClick(seat.id)}
                        >
                          {/* <p>Seat {seat.id}</p> */}
                          <img
                            className="seat-size"
                            src={
                              seat.selected
                                ? "/images/seater_selected.svg"
                                : "/images/seater_available.svg"
                            }
                            alt="seat"
                          />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                            <p style={{ fontSize: "0.75rem" }}>200</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="seats-container">
          <div className="stearing-container">
            <h5>Upper deck</h5>
            {/* <img src="/images/stearing.svg" alt="stearing" /> */}
          </div>
          <div className="bus-seats-container">
            {Array.from({ length: Math.ceil(sleeperList.length / 3) }).map(
              (_, rowIndex) => {
                const startIndex = rowIndex * 3;
                const singleBerth = sleeperList[startIndex];
                const doubleBerth = sleeperList.slice(
                  startIndex + 1,
                  startIndex + 3
                );

                return (
                  <div className="sleeper-row-container" key={rowIndex}>
                    <div
                      className={`single-berths`}
                      onClick={() => handleSleeperClick(singleBerth.id)}
                    >
                      <img
                        className="sleeper-size"
                        src={
                          singleBerth?.selected
                            ? "/images/sl_selected.svg"
                            : "/images/sl_available.svg"
                        }
                        alt="seat"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                        <p style={{ fontSize: "0.75rem" }}>200</p>
                      </div>
                    </div>

                    {/* Double berths */}
                    <div className="double-berths">
                      {doubleBerth?.map((sleeper) => (
                        <div
                          key={sleeper.id}
                          className={`sleeper-box`}
                          onClick={() => handleSleeperClick(sleeper.id)}
                        >
                          <img
                            className="sleeper-size"
                            src={
                              sleeper.selected
                                ? "/images/sl_selected.svg"
                                : "/images/sl_available.svg"
                            }
                            alt="seat"
                          />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                            <p style={{ fontSize: "0.75rem" }}>200</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="seats-infomation-cont">
          {/* <h3>Know your seat types</h3> */}
          <table>
            <thead>
              <tr>
                <th>Seat Types</th>
                <th>Seater</th>
                <th>Sleeper</th>
              </tr>
            </thead>
            <tbody>
              {seatsData?.map((eachRow) => (
                <tr key={eachRow?.id}>
                  <td>{eachRow?.text}</td>
                  <td>
                    <img
                      style={{ height: "30px", width: "30px" }}
                      src={eachRow?.seat}
                      alt="seat"
                    />
                  </td>
                  <td>
                    <img src={eachRow?.sleeper} alt="sleeper" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const passengetInfo = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          width: "100%",
          gap: "1rem",
          overflow: "auto",
        }}
      >
        {/* <form className="passenger-container">
          <div className="form-group">
            <p>Passenger Details</p>
            <label htmlFor="userName">Name</label>
            <div className="input-field-container">
              <MdOutlineEmail style={{ height: "20px", width: "20px" }} />
              <input
                type="text"
                placeholder="enter your email"
                name="userName"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <div className="input-field-container">
              <CiLock style={{ height: "20px", width: "20px" }} />
              <input
                type="text"
                placeholder="enter your password"
                name="age"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <div className="input-field-container">
              <CiLock style={{ height: "20px", width: "20px" }} />
              <input
                type="text"
                placeholder="enter your password"
                name="gender"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="input-field-container">
              <CiLock style={{ height: "20px", width: "20px" }} />
              <input
                type="text"
                placeholder="enter your password"
                name="phoneNumber"
                required
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form> */}

        <div className="passenger-container">
          <h3 className="passenger-details">Passenger Details</h3>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div component="span" className="passenger-details-container">
                <div className="passenger-icon-container">
                  <IoIosContact style={{ height: "30px", width: "30px" }} />
                </div>
                <div className="passenger-seat-info-container">
                  <h4>Passenger 1</h4>
                  <h6>Upper</h6>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="input-field-alignment-container">
                <TextField
                  variant="outlined"
                  label="Name"
                  name="userName"
                  onChange={handleInputChange}
                />
                <TextField
                  variant="outlined"
                  label="Age"
                  name="age"
                  onChange={handleInputChange}
                />
                <TextField
                  variant="outlined"
                  label="Gender"
                  name="Gender"
                  onChange={handleInputChange}
                />
                <TextField
                  variant="outlined"
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={handleInputChange}
                />
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography component="span">Accordion 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="bus-details-container">
          <div className="primo-container">
            <img src="/images/primo.svg" alt="primo" />
            <div className="primo-content-description-container">
              <h5>Top Handpicked Buses</h5>
              <p>No Extra Charges</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTabChange = (tabCategory) => {
    switch (tabCategory) {
      case "seats":
        setTabs({
          ...tabs,
          seatsTab: true,
          boardingTab: false,
          informTab: false,
        });
        setActiveTab(tabCategory);
        break;
      case "board":
        setTabs({
          ...tabs,
          boardingTab: true,
          seatsTab: false,
          informTab: false,
        });
        setActiveTab(tabCategory);
        break;
      case "info":
        setTabs({
          ...tabs,
          informTab: true,
          boardingTab: false,
          seatsTab: false,
        });
        setActiveTab(tabCategory);
        break;
      default:
        setTabs({
          ...tabs,
          informTab: false,
          boardingTab: false,
          seatsTab: false,
        });
        setActiveTab("");
        break;
    }
  };

  return (
    <div className="model-pop-up">
      <div className="popup-container">
        <div className="popup-top-part">
          <div className="pickup-drop-roote-container">
            <button className="cancel-btn" onClick={() => setPopUp(false)}>
              <ImCancelCircle
                style={{ fontSize: "1.3rem", marginBottom: "-5px" }}
              />
            </button>
            <h4>{searchBuses?.fromCity}</h4>
            <FaArrowRightLong style={{ color: "lightgray" }} />
            <h4>{searchBuses?.toCity}</h4>
          </div>
          <div className="tabs-container">
            <h5
              className={activeTab === "seats" ? "active-tab" : ""}
              onClick={() => handleTabChange("seats")}
            >
              1. Select seats
            </h5>
            <h5
              className={activeTab === "board" ? "active-tab" : ""}
              onClick={() => handleTabChange("board")}
            >
              2. Board/Drop point
            </h5>
            <h5
              className={activeTab === "info" ? "active-tab" : ""}
              onClick={() => handleTabChange("info")}
            >
              3. Passenger Info
            </h5>
          </div>
        </div>
        <div className="popup-center-part">
          {tabs?.boardingTab && boardingDropPointing()}
          {tabs?.seatsTab && seatsAlignment()}
          {tabs?.informTab && passengetInfo()}
        </div>

        <div className="popup-bottom-part">
          <button className="search-btn">Select seats</button>
        </div>
      </div>
    </div>
  );
};

export default ModelPopUp;
