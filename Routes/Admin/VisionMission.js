const express = require("express");
const router = express.Router();

const {
  addVisionMission,
  getAllVisionMission,
  deleteVisionMission,
  editVisionMission,
} = require("../../Controller/Admin/VisionMission");

router.post("/addVisionMission", addVisionMission);
router.put("/editVisionMission", editVisionMission);
router.get("/getAllVisionMission", getAllVisionMission);
router.delete("/deleteVisionMission/:id", deleteVisionMission);

module.exports = router;
