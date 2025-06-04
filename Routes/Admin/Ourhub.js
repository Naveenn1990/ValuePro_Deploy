const express = require("express");
const router = express.Router();
const Ourhubcontroller = require("../../Controller/Admin/Ourhub");

router.post("/addOurhub", Ourhubcontroller.addOurhub);
router.put("/editOurhub", Ourhubcontroller.editOurhub);
router.get("/getOurhub", Ourhubcontroller.getOurhub);
router.delete("/deleteOurhub/:id", Ourhubcontroller.deleteOurhub);

module.exports = router;
