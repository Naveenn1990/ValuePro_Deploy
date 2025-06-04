const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const walletSchema = new Schema(
  {

    vendorName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    vendorId: {
      type: ObjectId,
      ref: "vendor",
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
    transaction: [
      {
          title:{
            type: String
        },
          AcNo:{
            type:String
        },
          payId:{
            type:String
        },
        amount: {
          type: Number,
        },
        //Cr or Dr
        status:{
            type:String,
        },
        date:{
          type:Date,
          default:Date.now()
        }
      },
    ],
    isBlock:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

const driverModel = mongoose.model("Wallet", walletSchema);
module.exports = driverModel;
