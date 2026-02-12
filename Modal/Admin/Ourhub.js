const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ourhub = new Schema(
  {
    hubName: {
      type: String,
      required: true,
    },
    areaName: {
      type: String,
      required: true,
    },
    pincodes: [{
      type: String,
      required: true,
    }],
  },
  { timestamps: true }
);

const OurhubModel = mongoose.model("Ourhub", Ourhub);
module.exports = OurhubModel;
