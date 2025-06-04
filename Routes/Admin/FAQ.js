const express = require("express");
const router = express.Router();

const {
  addFAQ,
  getAllFaq,
  deleteFAQ,
  editFAQ,
} = require("../../Controller/Admin/FAQ");

router.post("/addFaq", addFAQ);
router.put("/updateFaq", editFAQ);
router.get("/getAllFaq", getAllFaq);
router.delete("/deleteFaq/:id", deleteFAQ);

module.exports = router;
