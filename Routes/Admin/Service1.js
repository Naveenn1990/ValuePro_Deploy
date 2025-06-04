const express = require("express");
const router = express.Router();
const Service1controller = require("../../Controller/Admin/Service1");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Service");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addService", upload.any(), Service1controller?.addService);
router.put("/editService/:id", upload.any(), Service1controller?.editService);
router.get("/getService", Service1controller?.getService);
router.put("/deleteService/:id", Service1controller?.deleteService);
router.put("/mackActiveAndDeactive", Service1controller.mackActiveAndDeactive);
module.exports = router;
