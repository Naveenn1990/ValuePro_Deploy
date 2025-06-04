const express = require("express");
const router = express.Router();
const Enquirycontroller = require("../../Controller/User/Enquiry");
const multer = require("multer");

router.post("/addEnquiry",Enquirycontroller.addEnquiry);
router.get("getEnquiry",Enquirycontroller.getEnquiry);
router.delete("/deleteEnquiry/:Id",Enquirycontroller.deleteEnquiry);

module.exports = router;