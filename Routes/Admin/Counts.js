const CountsController = require("../../Controller/Admin/Counts");
const express = require("express");
const router = express.Router();

router.post("/addCounts", CountsController.Counts);
router.get("/getCounts", CountsController.getCounts);
router.delete("/deleteCounts/:Id", CountsController.deleteCounts);
router.put("/editCounts", CountsController.editCounts);
module.exports = router;
