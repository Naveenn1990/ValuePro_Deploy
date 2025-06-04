const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseShema = new Schema(
  {
    expanseT: {
      type: String,
    },
 
  },{ timestamps: true }
);

module.exports = mongoose.model("expenseType", expenseShema);
