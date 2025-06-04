const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WhyChooseUs = new Schema(
  {
    Header: {
      type: String,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

const WhyChooseUsModel = mongoose.model("WhyChooseUs", WhyChooseUs);
module.exports = WhyChooseUsModel;
