const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseShema = new Schema(
  {
    expanse: {
      type: String,
    },
    remarks: {
      type: String,
    },
    expanDate:{
        type:String
    },
    amount: {
      type: String,
    },
  },{ timestamps: true }
);

module.exports = mongoose.model("expense", expenseShema);
