const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pincode = new Schema(
  {
    state: {
      type: String,
    },
    city: {
        type: String,
      },
      area: {
        type: String,
      },
      pincode: {
        type: String,
      },

  },
  { timestamps: true }
);

const PincodeModel = mongoose.model("Pincode", Pincode);
module.exports = PincodeModel;
