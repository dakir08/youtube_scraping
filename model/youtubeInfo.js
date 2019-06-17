const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
  videoId: String,
  name: String,
  duration: String,
  thumbnail: String,
  description: String,
  downloadInfo: Array
});

const infoModel = mongoose.model("info", infoSchema);

module.exports = {
  infoSchema,
  infoModel
};
