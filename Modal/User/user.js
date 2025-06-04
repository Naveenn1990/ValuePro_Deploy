const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },

    // password: {
    //   type: String,
    // },
    // confirmpassword: {
    //   type: String,
    // },

    // userAddresses: [
    //   {
    //     address: String,
    //   },
    // ],
    // houseno: {
    //   type: String,
    // },
    // landmark: {
    //   type: String,
    // },

    mobilefcmtoken: {
      type: String,
    },
    webfcmtoken: {
      type: String,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModal = mongoose.model("user", user);
module.exports = userModal;
