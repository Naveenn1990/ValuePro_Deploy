const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Whatpeoplesay = new Schema(
  {
    Header9: {
      type: String,
    },
    img9: {
      type: String,
    },
    // title9: {
    //   type: String,
    // },
    desc9: {
      type: String,
    },
  },
  { timestamps: true }
);

const WhatpeoplesayModel = mongoose.model("Whatpeoplesay", Whatpeoplesay);
module.exports = WhatpeoplesayModel;
