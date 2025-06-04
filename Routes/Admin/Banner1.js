const express = require("express");
const router = express.Router();
const Bannercontroller = require("../../Controller/Admin/Banner1");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Banner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addBanner", upload.any(), Bannercontroller.addBanner);
router.post("/editBanner", upload.any(), Bannercontroller.editBanner);
router.get("/getBanner", Bannercontroller.getBanner);
router.post("/deleteBanner/:id", Bannercontroller.deleteBanner);

module.exports = router;
