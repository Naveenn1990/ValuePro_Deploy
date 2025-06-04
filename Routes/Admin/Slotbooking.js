const express = require("express");
const router = express.Router();
const Slotbookingcontroller = require("../../Controller/Admin/Slotbooking1");

router.post("/addSlotbooking", Slotbookingcontroller.addSlotbooking);
router.put("/editSlotbooking", Slotbookingcontroller.editSlotbooking);
router.get("/getSlotbooking", Slotbookingcontroller.getSlotbooking);
router.delete("/deleteSlotbooking/:id", Slotbookingcontroller.deleteSlotbooking);

module.exports = router;
