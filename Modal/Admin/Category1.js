const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", Category);
module.exports = CategoryModel;
