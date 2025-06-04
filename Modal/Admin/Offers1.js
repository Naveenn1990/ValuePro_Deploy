const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Offers = new Schema(
  {
    Msg: {
      type: String,
    },
    Discription: {
      type: String,
    },
    amount: {
      type: Number,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const OffersModel = mongoose.model("Offers", Offers);
module.exports = OffersModel;
