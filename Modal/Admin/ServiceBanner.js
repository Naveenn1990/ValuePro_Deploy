const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceBanner = new Schema(
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

const ServiceBannerModel = mongoose.model("ServiceBanner", ServiceBanner);
module.exports = ServiceBannerModel;
