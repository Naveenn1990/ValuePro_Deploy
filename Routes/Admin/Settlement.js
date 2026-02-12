const express = require("express");
const router = express.Router();
const SettlementController = require("../../Controller/Admin/Settlement");

router.get("/getPendingSettlements", SettlementController.getPendingSettlements);
router.post("/calculateSettlement", SettlementController.calculateSettlement);
router.post("/createSettlement", SettlementController.createSettlement);
router.put("/processSettlement", SettlementController.processSettlement);
router.get("/getAllSettlements", SettlementController.getAllSettlements);
router.get("/getSettlementsByVendor/:vendorId", SettlementController.getSettlementsByVendor);
router.put("/updateSettlement", SettlementController.updateSettlement);
router.delete("/deleteSettlement/:id", SettlementController.deleteSettlement);
router.get("/getSettlementStats", SettlementController.getSettlementStats);

module.exports = router;
