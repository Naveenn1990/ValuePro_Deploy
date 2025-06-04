const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Slotbooking1 = new Schema(
  {
    name: {
      type: String,
    },

    name1: {
        type: String,
      },

  },
  { timestamps: true }
);

const Slotbooking1Model = mongoose.model("Slotbooking", Slotbooking1);
module.exports = Slotbooking1Model;
