const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const About = new Schema(
  {
    abtimg: {
      type: String,
    },
    abticon: {
      type: String,
    },
    abtheader: {
      type: String,
    },
    abtdesc: {
      type: String,
    },
  },
  { timestamps: true }
);

const AboutModel = mongoose.model("About", About);
module.exports = AboutModel;
