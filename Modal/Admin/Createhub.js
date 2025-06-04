const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Createhub = new Schema(
  {
    name: {
      type: String,
    },

  },
  { timestamps: true }
);

const CreatehubModel = mongoose.model("Createhub", Createhub);
module.exports = CreatehubModel;
