const express = require("express");
const router = express.Router();
const Addresscontroller = require("../../Controller/Admin/Address");

router.post("/addAddress", Addresscontroller.addAddress);
router.get("/getAddress/:id", Addresscontroller.getAddress);
router.delete("/deleteaddress/:id",Addresscontroller.deleteaddress);

module.exports = router;
