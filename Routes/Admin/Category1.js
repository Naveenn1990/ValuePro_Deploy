const express = require("express");
const router = express.Router();
const Categorycontroller = require("../../Controller/Admin/Category1");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Category");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer();

router.post("/addCategory", upload.any(), Categorycontroller.addCategory);
router.post("/editCategory", upload.any(), Categorycontroller.editCategory);
router.get("/getCategory", Categorycontroller.getCategory);
router.post("/deleteCategory/:id", Categorycontroller.deleteCategory);

module.exports = router;
