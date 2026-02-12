const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const SettlementSchema = new Schema(
  {
    vendorId: {
      type: ObjectId,
      ref: "vendor",
      required: true,
    },
    vendorName: {
      type: String,
    },
    jobId: {
      type: ObjectId,
      ref: "jobs",
      required: true,
    },
    bookingAmount: {
      type: Number,
      required: true,
    },
    adminCommission: {
      type: Number,
      default: 0,
    },
    adminCommissionPercent: {
      type: Number,
      default: 0,
    },
    additionalCharges: {
      type: Number,
      default: 0,
    },
    chargesDescription: {
      type: String,
    },
    settlementAmount: {
      type: Number,
      required: true,
    },
    settlementStatus: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "UPI", "Cash", "Wallet"],
      default: "Bank Transfer",
    },
    transactionId: {
      type: String,
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },
    settledBy: {
      type: ObjectId,
      ref: "Admin",
    },
    settledDate: {
      type: Date,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const SettlementModel = mongoose.model("Settlement", SettlementSchema);
module.exports = SettlementModel;
