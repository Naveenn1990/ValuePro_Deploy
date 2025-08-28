const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let VisitSchema = new Schema(
  {
    visitcharge: {
      type: Number,
      default:0
    },
    cancelCharge:{
      type:Number,
      default:0
    },
    jobCharge:{
      type:Number,
      default:0
    }
  
  },
  { timestamps: true }
);
const CountsModel = mongoose.model("visitcharge", VisitSchema);
module.exports = CountsModel;
