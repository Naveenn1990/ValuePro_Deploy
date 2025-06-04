const express = require("express");
const router = express.Router();
const Pincodecontroller = require("../../Controller/Admin/Pincode");

router.post("/addPincode", Pincodecontroller.addPincode);
router.put("/editPincode", Pincodecontroller.editPincode);
router.get("/getPincode", Pincodecontroller.getPincode);
router.delete("/deletePincode/:id", Pincodecontroller.deletePincode);

module.exports = router;
