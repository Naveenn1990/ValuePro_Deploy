const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const Address = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    state: {
      type: String,
    },
    AddressType: {
      type: String,
    },
    city: {
      type: String,
    },
    village: {
      type: String,
    },
    houseno: {
      type: String,
    },
    pincode: {
      type: String,
    },
    lat:{
      type: Number,
    },
    lang:{
      type: Number,
    },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Address", Address);
module.exports = AddressModel;
