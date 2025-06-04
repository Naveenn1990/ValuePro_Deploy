const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    Cpassword: {
      type: String,
    },
    otp: {
      type: Number,
    },
    contactnum: {
      type: Number,
    },
    User: {
      type: Boolean,
      default: true,
    },
    product: {
      type: Boolean,
      default: true,
    },
    Vendor: {
      type: Boolean,
      default: true,
    },
    banner: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Boolean,
      default: true,
    },
    Jobs: {
      type: Boolean,
      default: true,
    },
    service: {
      type: Boolean,
      default: true,
    },
    referral: {
      type: Boolean,
      default: true,
    },
    offer: {
      type: Boolean,
      default: true,
    },
    payments: {
      type: Boolean,
      default: true,
    },
    Expense: {
      type: Boolean,
      default: true,
    },
    expanseType: {
      type: Boolean,
      default: true,
    },
    subAdmin: {
      type: Boolean,
      default: true,
    },
    Attendance: {
      type: Boolean,
      default: true,
    },
    Expense: {
      type: Boolean,
      default: true,
    },
    CreditDebit: {
      type: Boolean,
      default: true,
    },
    ProfitLoss: {
      type: Boolean,
      default: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const adminModel = mongoose.model("Admin", Admin);
module.exports = adminModel;
