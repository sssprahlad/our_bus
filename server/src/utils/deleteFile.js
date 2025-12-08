const fs = require("fs");
const path = require("path");

exports.deleteFile = (fileName) => {
  if (!fileName) return;

  const filePath = path.join(__dirname, "../uploads/uploads", fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("Error deleting file:", err.message);
    } else {
      console.log("File deleted:", fileName);
    }
  });
};
