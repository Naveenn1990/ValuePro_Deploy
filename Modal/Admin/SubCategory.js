const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategory = new Schema(
  {
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", SubCategory);
module.exports = SubCategoryModel;
