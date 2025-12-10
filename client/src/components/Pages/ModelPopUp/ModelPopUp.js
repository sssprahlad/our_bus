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
import { POST_BOOKING_API } from "../../../constants/Constants";

const ModelPopUp = ({
  searchBuses,
  setPopUp,
  busDetails,
  selectedBusDetails,
}) => {
  const [passengerDetails, setPassengerDetails] = useState({
    busId: "",
    seatId: "",
    userId: "",
    userName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    travelDate: "",
    boardingPoint: "",
    dropingPoint: "",
    seatType: "",
  });

  const [formValid, setFormValid] = useState(false);

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
  const [totalAmount, setTotalAmount] = useState(0);

  const [seatList, setSeatList] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      selected: false,
    }))
  );
  const [selectedSeatsList, setSelectedSeatsList] = useState([]);
  //const [sortedSelectedSeatsList, setSortedSelectedSeatsList] = useState();

  const [sleeperList, setSleeperList] = useState(
    Array.from({ length: 0 }, (_, i) => ({
      id: i + 1,
      selected: false,
    }))
  );

  const [passengerDetailsList, setPassengerDetailsList] = useState([]);

  const sortedSelectedSeatsList = selectedSeatsList.sort((a, b) => a.id - b.id);

  useEffect(() => {
    if (!sortedSelectedSeatsList || sortedSelectedSeatsList.length === 0)
      return;

    const newList = sortedSelectedSeatsList.map((seat) => ({
      busId: selectedBusDetails.id,
      seatId: seat.id,
      userId: localStorage.getItem("userId"),
      userName: "",
      gender: "",
      age: "",
      phoneNumber: "",
      travelDate: new Date().toISOString().split("T")[0],
      boardingPoint: passengerDetails.boardingPoint,
      dropingPoint: passengerDetails.dropingPoint,
      seatType: seat.type,
    }));

    setPassengerDetailsList(newList);
  }, [sortedSelectedSeatsList, passengerDetails]);

  useEffect(() => {
    if (
      !Array.isArray(passengerDetailsList) ||
      passengerDetailsList.length === 0
    ) {
      setFormValid(false);
      return;
    }

    const isValid = passengerDetailsList.every(
      (p) =>
        p.userName?.trim()?.length > 0 &&
        p.age?.trim()?.length > 0 &&
        p.gender?.trim()?.length > 0 &&
        p.phoneNumber?.trim()?.length > 0
    );

    setFormValid(isValid);
  }, [passengerDetailsList]);

  console.log("Are all passenger fields valid? =>", formValid);

  console.log(passengerDetailsList, "passenger details");

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

  const seatsPerRow = sleeperList.length === 0 ? 4 : 3;

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;

    setPassengerDetailsList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
      return updated;
    });

    //setPassengerDetails({ ...passengerDetails, [name]: value });
  };

  console.log(selectedSeatsList, "select seats");

  useEffect(() => {
    const amount = sortedSelectedSeatsList.reduce((sum, seat) => {
      return (
        sum +
        (seat.type === "sleeper"
          ? selectedBusDetails?.sleeper_price
          : selectedBusDetails?.seat_price)
      );
    }, 0);

    setTotalAmount(amount);
  }, [sortedSelectedSeatsList]);

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
        setPassengerDetailsList({
          ...passengerDetailsList,
          boardingPoint: bp.point,
        });
      } else {
        setPassengerDetails({
          ...passengerDetails,
          dropingPoint: bp.point,
        });

        setPassengerDetailsList({
          ...passengerDetailsList,
          dropingPoint: bp.point,
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
                  checked={passengerDetails?.boardingPoint === bp.point}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="boarding-point-container">
          <div className="boarding-details-cont">
            <h3>Dropping points</h3>
            <p className="drop-select-text">{passengerDetails?.dropingPoint}</p>
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
                  name="dropingPoint"
                  checked={passengerDetails?.dropingPoint === dp.point}
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
        const exists = prev.find((x) => x.type === "seater" && x.id === seatId);

        if (exists) {
          return prev.filter((x) => !(x.type === "seater" && x.id === seatId));
        } else {
          return [...prev, { type: "seater", id: seatId }];
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
            {Array.from({
              length: Math.ceil(seatList.length / seatsPerRow),
            }).map((_, rowIndex) => {
              const startIndex = rowIndex * seatsPerRow;

              // 4 seats case → [2 seats left + 2 seats right]
              if (seatsPerRow === 4) {
                const leftSeats = seatList.slice(startIndex, startIndex + 2);
                const rightSeats = seatList.slice(
                  startIndex + 2,
                  startIndex + 4
                );

                return (
                  <div className="seats-row-container" key={rowIndex}>
                    {/* Left 2 seats */}
                    <div className="double-seats">
                      {leftSeats.map((seat) => (
                        <div
                          key={seat.id}
                          className="seat-box-double"
                          onClick={() => handleSeatClick(seat.id)}
                        >
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
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                            <p style={{ fontSize: "0.75rem" }}>
                              {selectedBusDetails?.seat_price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right 2 seats */}
                    <div className="double-seats">
                      {rightSeats.map((seat) => (
                        <div
                          key={seat.id}
                          className="seat-box-double"
                          onClick={() => handleSeatClick(seat.id)}
                        >
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
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                            <p style={{ fontSize: "0.75rem" }}>
                              {" "}
                              {selectedBusDetails?.seat_price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 3 seats case → 1 single + 2 double
              const singleSeat = seatList[startIndex];
              const doubleSeats = seatList.slice(
                startIndex + 1,
                startIndex + 3
              );

              return (
                <div className="seats-row-container" key={rowIndex}>
                  {/* single seat */}
                  <div
                    className="single-seats"
                    onClick={() => handleSeatClick(singleSeat.id)}
                  >
                    <img
                      className="seat-size"
                      src={
                        singleSeat.selected
                          ? "/images/seater_selected.svg"
                          : "/images/seater_available.svg"
                      }
                      alt="seat"
                    />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                      <p style={{ fontSize: "0.75rem" }}>
                        {" "}
                        {selectedBusDetails?.seat_price}
                      </p>
                    </div>
                  </div>

                  {/* double seats */}
                  <div className="double-seats">
                    {doubleSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="seat-box"
                        onClick={() => handleSeatClick(seat.id)}
                      >
                        <img
                          className="seat-size"
                          src={
                            seat.selected
                              ? "/images/seater_selected.svg"
                              : "/images/seater_available.svg"
                          }
                          alt="seat"
                        />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                          <p style={{ fontSize: "0.75rem" }}>
                            {" "}
                            {selectedBusDetails?.seat_price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sleeperList?.length > 0 && (
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
                          <p style={{ fontSize: "0.75rem" }}>
                            {" "}
                            {selectedBusDetails?.sleeper_price}
                          </p>
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
                              <p style={{ fontSize: "0.75rem" }}>
                                {" "}
                                {selectedBusDetails?.sleeper_price}
                              </p>
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
        )}

        <div className="seats-infomation-cont">
          {/* <h3>Know your seat types</h3> */}
          <table>
            <thead>
              <tr>
                <th>Seat Types</th>
                <th>Seater</th>
                {sleeperList?.length > 0 && <th>Sleeper</th>}
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
                  {sleeperList?.length > 0 && (
                    <td>
                      <img src={eachRow?.sleeper} alt="sleeper" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleBookingTickets = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(POST_BOOKING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bookings: passengerDetailsList,
        }),
      });

      const data = await response.json();

      console.log(data, "booking results");
    } catch (error) {
      console.log(error.message);
    }
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
        <div className="passenger-container">
          <h3 className="passenger-details">Passenger Details</h3>
          {sortedSelectedSeatsList?.map((eachPassengerDetails, index) => {
            return (
              <div key={index}>
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div
                      component="span"
                      className="passenger-details-container"
                    >
                      <div className="passenger-icon-container">
                        <IoIosContact
                          style={{ height: "30px", width: "30px" }}
                        />
                      </div>
                      <div className="passenger-seat-info-container">
                        <h4>{`Passenger ${index + 1}`}</h4>
                        <h6>{`Seat ${
                          eachPassengerDetails?.type === "sleeper"
                            ? `U${eachPassengerDetails?.id}, Upper Deck`
                            : `${eachPassengerDetails?.id}, Lower Deck`
                        }`}</h6>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="input-field-alignment-container">
                      <TextField
                        variant="outlined"
                        label="Name"
                        name="userName"
                        onChange={(e) => handleInputChange(index, e)}
                        value={passengerDetailsList[index]?.userName || ""}
                      />
                      <TextField
                        variant="outlined"
                        label="Age"
                        name="age"
                        onChange={(e) => handleInputChange(index, e)}
                        value={passengerDetailsList[index]?.age || ""}
                      />
                      <TextField
                        variant="outlined"
                        label="Gender"
                        name="gender"
                        onChange={(e) => handleInputChange(index, e)}
                        value={passengerDetailsList[index]?.gender || ""}
                      />
                      <TextField
                        variant="outlined"
                        label="Phone Number"
                        name="phoneNumber"
                        onChange={(e) => handleInputChange(index, e)}
                        value={passengerDetailsList[index]?.phoneNumber || ""}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })}
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
            <button
              className={activeTab === "seats" ? "active-tab" : ""}
              onClick={() => handleTabChange("seats")}
            >
              1. Select seats
            </button>
            <button
              className={activeTab === "board" ? "active-tab" : ""}
              // onClick={() => handleTabChange("board")}
              onClick={
                selectedSeatsList.length > 0
                  ? () => handleTabChange("board")
                  : undefined
              }
            >
              2. Board/Drop point
            </button>
            <button
              className={activeTab === "info" ? "active-tab" : ""}
              //onClick={() => handleTabChange("info")}

              onClick={
                passengerDetailsList[0]?.boardingPoint?.length > 0 &&
                passengerDetailsList[0]?.dropingPoint?.length > 0
                  ? () => handleTabChange("info")
                  : undefined
              }
            >
              3. Passenger Info
            </button>
          </div>
        </div>

        <div className="popup-center-part">
          {tabs?.boardingTab && boardingDropPointing()}
          {tabs?.seatsTab && seatsAlignment()}
          {tabs?.informTab && passengetInfo()}
        </div>

        {selectedSeatsList?.length > 0 &&
          !passengerDetailsList[0]?.dropingPoint?.length > 0 && (
            <div className="popup-bottom-part">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  margin: "0rem 1rem",
                }}
              >
                <h5>{`${selectedSeatsList?.length} seats`}</h5>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.1rem",
                  }}
                >
                  <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                  <h4> {totalAmount}</h4>
                </div>
              </div>

              <button
                className="dropping-btn"
                onClick={() => handleTabChange("board")}
              >
                Select boading & dropping points
              </button>
            </div>
          )}

        {passengerDetailsList[0]?.boardingPoint?.length > 0 &&
          passengerDetailsList[0]?.dropingPoint?.length > 0 && (
            <div className="popup-bottom-part">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  margin: "0rem 1rem",
                }}
              >
                <h5>{`${selectedSeatsList?.length} seats`}</h5>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.1rem",
                  }}
                >
                  <FaRupeeSign style={{ fontSize: "0.75rem" }} />
                  <h4> {totalAmount}</h4>
                </div>
              </div>

              {formValid ? (
                <button className="dropping-btn" onClick={handleBookingTickets}>
                  Continue booking
                </button>
              ) : (
                <button
                  className="dropping-btn"
                  onClick={
                    passengerDetailsList[0]?.boardingPoint?.length > 0 &&
                    passengerDetailsList[0]?.dropingPoint?.length > 0
                      ? () => handleTabChange("info")
                      : undefined
                  }
                >
                  Fill passenger details
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ModelPopUp;
