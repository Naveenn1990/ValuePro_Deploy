const express = require("express");
const router = express.Router();
const Prorequestcontroller = require("../../Controller/User/ProRequest");
const multer = require("multer");

router.post("/addProrequest",Prorequestcontroller.addProrequest);
router.get("/getProrequest",Prorequestcontroller.getProrequest);
router.delete("/deleteProrequest/:id",Prorequestcontroller.deleteProrequest);
router.put("/editProrequest",Prorequestcontroller.editProre)
router.put(
  "/Prorequestcontroller",
  Prorequestcontroller.makeApproveAndHoldVendor
);
module.exports = router;