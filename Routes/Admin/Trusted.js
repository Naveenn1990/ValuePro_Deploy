const express = require("express");
const router = express.Router();
const Trustedcontroller = require("../../Controller/Admin/Trusted");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Trusted");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addTrusted", upload.any(), Trustedcontroller.addTrusted);
router.post("/editTrusted", upload.any(), Trustedcontroller.editTrusted);
router.get("/getTrusted", Trustedcontroller.getTrusted);
router.post("/deleteTrusted/:id", Trustedcontroller.deleteTrusted);

module.exports = router;
