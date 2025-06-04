const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const VenderLeave = new Schema(
  {
    userId: {
      type: ObjectId,
    },
    VendorName: {
        type: String,
      },
    days: {
      type: String,
    },
    Fromdate: {
      type: String,
    },
    Todate: {
      type: String,
    },
    Reason: {
      type: String,
    },
     status: {
        type: String,
        default: "Pending",
    },
     adminreason: {
        type: String,
    },
  },
  { timestamps: true }
);
const LeaveModel = mongoose.model("VenderLeave", VenderLeave);
module.exports = LeaveModel;
