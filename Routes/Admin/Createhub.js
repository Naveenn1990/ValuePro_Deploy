const express = require("express");
const router = express.Router();
const Createhubcontroller = require("../../Controller/Admin/Createhub");

router.post("/addCreatehub",  Createhubcontroller.addCreatehub);
router.put("/editCreatehub", Createhubcontroller.editCreatehub);
router.get("/getCreatehub", Createhubcontroller.getCreatehub);
router.post("/deleteCreatehub/:id", Createhubcontroller.deleteCreatehub);

module.exports = router;
