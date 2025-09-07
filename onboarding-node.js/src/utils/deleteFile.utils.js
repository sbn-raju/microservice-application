const fs = require("fs");
const path = require("path");


function deleteFileByName(filename) {
  const filePath = path.join(__dirname, "../uploads", filename);
  try {
    fs.unlinkSync(filePath);
    console.log("File deleted:", filename);
    return true;
  } catch (err) {
    console.error("Error deleting file:", err.message);
    return false;
  }
}



module.exports = deleteFileByName
