const Bus = require("../models/busModel");
const multer = require("multer");
const path = require("path");
const { deleteFile } = require("../utils/deleteFile");

exports.addBusDetails = (req, res) => {
  const {
    busName,
    busType,
    totalSeats,
    totalSleeper,
    seatPrice,
    sleeperPrice,
    fromCity,
    toCity,
    distanceKm,
    departureTime,
    arrivalTime,
    duration,
    stops,
  } = req.body;
  console.log(req.body);

  const busImage = req.file ? req.file.filename : null;

  console.log(busImage, "image");

  if (
    !busName ||
    !busType ||
    totalSeats == null ||
    totalSleeper == null ||
    seatPrice == null ||
    sleeperPrice == null ||
    !fromCity ||
    !toCity ||
    distanceKm == null ||
    !departureTime ||
    !arrivalTime ||
    !duration ||
    !stops ||
    !busImage
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are required." });
  }

  try {
    Bus.createBusPost(
      busName,
      busType,
      totalSeats,
      totalSleeper,
      seatPrice,
      sleeperPrice,
      fromCity,
      toCity,
      distanceKm,
      departureTime,
      arrivalTime,
      duration,
      busImage,
      stops,
      async (err) => {
        if (err)
          return res
            .status(400)
            .json({ status: 400, message: "failed to add bus details" });

        return res.status(200).json({
          status: 200,
          message: `${busName} bus details added successfully`,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 400, message: "bus details add to failed" });
  }
};

exports.updateBusDetails = (req, res) => {
  const busId = req.params.id;

  const {
    busName,
    busType,
    totalSeats,
    totalSleeper,
    seatPrice,
    sleeperPrice,
    fromCity,
    toCity,
    distanceKm,
    departureTime,
    arrivalTime,
    duration,
  } = req.body;

  //   console.log(busImage, "image");
  //   console.log(busId, "busId");

  const newImage = req.file ? req.file.filename : null;

  Bus.getBusById(busId, (err, bus) => {
    if (err || !bus) return res.status(404).json({ message: "Bus not found" });

    const oldImg = bus.bus_image;
    if (newImage && oldImg) {
      deleteFile(oldImg);
    }

    try {
      Bus.patchBusDetails(
        busName,
        busType,
        totalSeats,
        totalSleeper,
        seatPrice,
        sleeperPrice,
        fromCity,
        toCity,
        distanceKm,
        departureTime,
        arrivalTime,
        duration,
        newImage ? newImage : oldImg,
        busId,
        async (err, result) => {
          if (err) return res.status(400).json({ message: "Data base error" });

          if (result.changes == 0)
            return res
              .status(404)
              .json({ status: 404, message: "Bus not found" });

          return res
            .status(200)
            .json({ status: 200, message: "Bus Details update successfully." });
        }
      );
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ status: 400, message: "Failed to update details" });
    }
  });
};

exports.getAllBuses = (req, res) => {
  try {
    Bus.getAllBusDetails((err, existingBuses) => {
      if (err)
        return res
          .status(400)
          .json({ status: 400, message: "Failed to get all bus details." });

      return res.status(200).json({
        status: 200,
        message: "fetch bus details successfully.",
        allBus: existingBuses,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

exports.deleteBusDetails = (req, res) => {
  const busId = req.params.id;

  Bus.getBusById(busId, (err, bus) => {
    if (err || !bus) return res.status(404).json({ message: "Bus not found" });

    const oldImg = bus.bus_image;

    try {
      Bus.getDeleteBusById(busId, (err) => {
        if (err)
          return res
            .status(500)
            .json({ status: 500, message: "Database error" });
        if (oldImg) deleteFile(oldImg);

        return res
          .status(200)
          .json({ status: 200, message: "Bus Details delete successfully." });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 500, message: "Failed to delete bus item." });
    }
  });
};

exports.getBusDetails = (req, res) => {
  const busId = req.params.id;

  Bus.getBusById(busId, (err, bus) => {
    if (err) {
      return res.status(400).json({ message: "Bus not found" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "get bus details.", busDetails: bus });
  });
};
