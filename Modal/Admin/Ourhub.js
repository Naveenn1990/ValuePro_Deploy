const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ourhub = new Schema(
  {
    name: {
      type: String,
    },
    // state: {
    //     type: String,
    // },
    // city: {
    //     type: String,
    // },
    // area: {
    //     type: String,
    // },
    pincode: {
      type: String,
    },
    pincodeid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pincode",
    },
  },
  { timestamps: true }
);

const OurhubModel = mongoose.model("Ourhub", Ourhub);
module.exports = OurhubModel;
