const express = require("express");
const router = express.Router();
const Aboutcontroller = require("../../Controller/Admin/About");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/About");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addAbout", upload.any(), Aboutcontroller.addAbout);
router.put("/editAbout", upload.any(), Aboutcontroller.editAbout);
router.get("/getAbout", Aboutcontroller.getAbout);
router.delete("/deleteAbout/:id", Aboutcontroller.deleteAbout);

module.exports = router;
