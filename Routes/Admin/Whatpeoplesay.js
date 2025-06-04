const express = require("express");
const router = express.Router();
const Whatpeoplesaycontroller = require("../../Controller/Admin/Whatpeoplesay");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Whatpeoplesay");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addWhatpeoplesay", upload.any(), Whatpeoplesaycontroller.addWhatpeoplesay);
router.put("/editWhatpeoplesay", upload.any(), Whatpeoplesaycontroller.editWhatpeoplesay);
router.get("/getWhatpeoplesay", Whatpeoplesaycontroller.getWhatpeoplesay);
router.delete("/deleteWhatpeoplesay/:id", Whatpeoplesaycontroller.deleteWhatpeoplesay);

module.exports = router;
