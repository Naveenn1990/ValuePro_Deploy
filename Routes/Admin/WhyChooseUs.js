const express = require("express");
const router = express.Router();
const Whychooseuscontroller = require("../../Controller/Admin/WhyChooseUs");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Whychooseus");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addWhychooseus", upload.any(), Whychooseuscontroller.addWhychooseus);
router.put("/editWhychooseus", upload.any(), Whychooseuscontroller.editWhychooseus);
router.get("/getWhychooseus", Whychooseuscontroller.getWhychooseus);
router.delete("/deleteWhychooseus/:id", Whychooseuscontroller.deleteWhychooseus);

module.exports = router;
