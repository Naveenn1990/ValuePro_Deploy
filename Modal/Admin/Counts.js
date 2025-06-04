const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CountsSchema = new Schema(
  {
    Counts: {
      type: String,
    },
    Text: {
      type: String,
    }
  },
  { timestamps: true }
);
const CountsModel = mongoose.model("Counts", CountsSchema);
module.exports = CountsModel;
