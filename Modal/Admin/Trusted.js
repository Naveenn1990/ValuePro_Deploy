const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Trusted = new Schema(
  {
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

const TrustedModel = mongoose.model("Trusted", Trusted);
module.exports = TrustedModel;
