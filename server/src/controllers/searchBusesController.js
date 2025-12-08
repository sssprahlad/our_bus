const SearchBuses = require("../models/searchBusesModel");

exports.searchBusesDetails = (req, res) => {
  const { fromCity, toCity, date } = req.query;

  try {
    SearchBuses.getBuses(fromCity, toCity, date, (err, buses) => {
      if (err)
        return res
          .status(400)
          .json({ status: 400, message: "failed to get bus details." });

      return res.status(200).json({
        status: 200,
        message: "bus details fetched successfully.",
        buses: buses,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: 400, message: "bus details get to failed." });
  }
};
