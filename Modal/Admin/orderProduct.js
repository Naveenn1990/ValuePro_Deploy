const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productOrder = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
  
    vendorId: {
      type: ObjectId,
      ref: "vendor",
    },
    vendorName: {
      type: String,
    },
    vendorEmail: {
      type: String,
    },
    vendorMobile: {
      type: String,
    },
    TotalAmount: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },


    ProductData: [
      {
        //productId,productName,quantity,price,totalPrice
        productId: {
          type: ObjectId,
          ref: "product",
        },
        productName: {
          type: String,
         
        },
        price: {
          type: Number,
          default: 0,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
 
    status: {
      type: String,
      default: "Inprocess",
    },
   
    payAmount: {
      type: Number,
      default: 0,
    },
    payId: {
      type: String,
    },
   
    reason: {
      type: String,
    },
    deliverStatus:{
        type:String,
        default:"Pending",
        enum: ['Pending','Confirm','Shipped','Delivered',],
    },
    deliverName:{
        type:String
    },
    delivermobile:{
        type:String
    },
    deliveCharge:{
        type:Number,
        default:0
    },
    paymentStatus: {
      type: String,
      default: "Under Process",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    userAddress: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("productOrder", productOrder);