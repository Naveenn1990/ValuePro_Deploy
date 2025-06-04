const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Protiming = new Schema(
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

const ProtimingModel = mongoose.model("Protiming", Protiming);
module.exports = ProtimingModel;
