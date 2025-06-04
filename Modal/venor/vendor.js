const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId
const VenorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    toRefNum: {
      type: String,
    },
    RefNum: {
      type: String,
    },
    profile: {
      type: String,
    },
    addhar: {
      type: String,
    },
    adharDocFront: {
      type: String,
    },
    adharDocBack: {
      type: String,
    },
    pancard: {
      type: String,
    },

    panDoc: {
      type: String,
    },
    gst: {
      type: String,
    },
    gstDoc: {
      type: String,
    },
    area: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    piccode: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    Active: {
      type: String,
      default: "Ofline",
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    AvRating: {
      type: Number,
      default: 0,
    },
    residential: {
      type: String,
    },
    police: {
      type: String,
    },
    // bankDetails
    BankName: { type: String },
    AcNo: { type: String },
    ifceCode: { type: String },
    ACHoldName: { type: String },
    Branch: { type: String },

    commision: {
      type: Number,
      //   default: 0,
    },
    rating: [
      {
        userId: {
          type: String,
        },
        jobId:{
          type:ObjectId,
          ref:"jobs"
        },
        userName: {
          type: String,
        },
        comment: {
          type: String,
        },
        rate: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],

    ResponseRate: {
      type: Number,
      default: 0,
    },
    DeliveryRate: {
      type: Number,
      default: 0,
    },
    location: {
      type: { type: String },
      coordinates: [Number], // [longitude, latitude]
    },
    latitude:{
         type: Number,
    }, 
    longitude:{
       type: Number,  
    },
    assignmentTime: {
      type: String,
    },
    assignmentHubPincode: {
      type: Number,
    },
    Hub:{
      type:String
    },
    fcmtoken:{
      type:String
    },
  TimeOn:[{
      date:{
        type:String
      },
      time:{
        type:String
      }
    }]
  },
  { timestamps: true }
);
VenorSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("vendor", VenorSchema);
