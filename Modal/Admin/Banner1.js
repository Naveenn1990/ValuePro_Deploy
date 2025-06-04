const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Banner = new Schema(
  {
    name: {
      type: String,
    },

    img: {
      type: String,
    },
     tagline: {
      type: String,
    },
      url: {
      type: String,
    },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", Banner);
module.exports = BannerModel;
