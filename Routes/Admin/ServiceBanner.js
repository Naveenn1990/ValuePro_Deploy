const express = require("express");
const router = express.Router();
const ServiceBannercontroller = require("../../Controller/Admin/ServiceBanner");
const multer = require("multer");

const upload = multer();

router.post(
  "/addServiceBanner",
  upload.any(),
  ServiceBannercontroller.addServiceBanner
);
router.post(
  "/editServiceBanner",
  upload.any(),
  ServiceBannercontroller.editServiceBanner
);
router.get("/getServiceBanner", ServiceBannercontroller.getServiceBanner);
router.post(
  "/deleteServiceBanner/:id",
  ServiceBannercontroller.deleteServiceBanner
);

module.exports = router;
