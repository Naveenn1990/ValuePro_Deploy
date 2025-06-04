const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Service = new Schema(
  {
    ProductName: {
      type: String,
    },
    name: {
      type: String,
    },
    category: {
      type: String,
    },

    img: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
    },
    commission: {
      type: Number,
      default:0
    },
    tax: {
      type: String,
    },
    warrantyperiod: {
      type: String,
    },
    warrentyTillDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model("Service", Service);
module.exports = ServiceModel;
