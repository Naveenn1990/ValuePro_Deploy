const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    userName: {
      type: String,
    },
    userMobile: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    vendorId: {
      type: ObjectId,
      ref: "vendor",
    },
    JobRejectVendor: [
      {
        vendorId: {
          type: ObjectId,
          ref: "vendor",
        },
        vendorName: {
          type: String,
        },
        vendorMobile: {
          type: String,
        },
      },
    ],

    JobAssignedVendor: [
      {
        vendorId: {
          type: ObjectId,
          ref: "vendor",
        },
        vendorName: {
          type: String,
        },
        vendorMobile: {
          type: String,
        },
        status: {
          type: String,
        },
      },
    ],
    vendorName: {
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
    serviceAmount: {
      type: Number,
      default: 0,
    },
     RequestAmount: {
      type: Number,
      default: 0,
    },
    serviceDate: {
      type: String,
    },
    serviceRemark: {
      type: String,
    },
    serviceTime: {
      type: String,
    },
    jobType: {
      type: String,
    },
    serviceType: [
      {
        serviceId: {
          type: ObjectId,
          ref: "Service",
        },
        price: {
          type: Number,
          default: 0,
        },
        quntitity: {
          type: Number,
          default: 0,
        },
        name: {
          type: String,
        },
         actualPrice: {
          type: Number,
          default: 0,
        },
         commission: {
          type: Number,
          default: 0,
        },
      },
    ],
    servecePoint: [
      {
        productId: {
          type: ObjectId,
          ref: "product",
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
          default: 0,
        },
        actualPrice: {
          type: Number,
          default: 0,
        },
        quntitity: {
          type: Number,
          default: 0,
        },
      },
    ],

    comment: {
      type: String,
    },
    rate: {
      type: Number,
      default: 0,
    },

    cotision: {
      type: String,
      default: "Pending",
    },
    VendorStatus: {
      type: String,
      default: "Pending",
    },
    status: {
      type: String,
      default: "Pending",
    },
    refouned:{
          type: String,
    },
    Image1: {
      type: String,
    },
    Image2: {
      type: String,
    },
    Image3: {
      type: String,
    },
    Image4: {
      type: String,
    },
    requestProof: {
      type: String,
    },
    uploadImage: {
      type: Boolean,
      default: false,
    },
    handOverImage1: {
      type: String,
    },
    handOverImage2: {
      type: String,
    },
    handOverImage3: {
      type: String,
    },
    handOverImage4: {
      type: String,
    },
    handOver: {
      type: Boolean,
      default: false,
    },
    payAmount: {
      type: Number,
      default: 0,
    },
    payId: {
      type: String,
    },
    vendorAdvanceAm: {
      type: Number,
    },
    reason: {
      type: String,
    },
    scheduleDate: {
      type: String,
    },

    scheduleTime: {
      type: String,
    },
    paymentStatus: {
      type: String,
      default: "Under Process",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    Element: {
      type: String,
    },
    userAddress: {
      type: String,
    },
    houseno: {
      type: String,
    },
    landmark: {
      type: String,
    },
    placeAddress: {
      type: String, // is it home or work or other
    },
    AssignedHubPincode: {
      type: Number,
    },
    pincode: {
      type: String,
    },
    notworkingReason: {
      type: String,
    },
    location: {
      type: { type: String },
      coordinates: [Number], // [longitude, latitude]
    },
    assignmentTime: {
      type: String,
    },
    AssignedBy: {
      type: String,
      default: "AUTO",
    },
    Avoidcallingbefore: {
      type: Boolean,
      default: false,
    },
    revisitStatus:{
      type: String,
      default: "Pending",
    },
    revijitCount:{
      type: Number,
      default: 0,
    },
    
    revijitAmount:{
      type: Number,
      default: 0,
    },
    recivedammount: {
      type: Number,
      // required: true,
    },
    commissionId: {
      type: String,
      // required: true,
    },
    statuscheck: {
      type: String,
      default: "pending",
    },
    chat: [],
    jobcommision:{
        type:Number,
        default:0
    },
    servicecommission:{
          type: String,
    },
    productcommission:{
          type: String,
    },
    rideStart:{
        type:Boolean,
        default:false
    },
  },
  { timestamps: true }
);
jobSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("jobs", jobSchema);
