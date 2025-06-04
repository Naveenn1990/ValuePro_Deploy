const express = require("express");
const router = express.Router();
const Revisitcontroller = require("../../Controller/User/RevisitRequest");
const multer = require("multer");

router.post("/addRevisit",Revisitcontroller.addRevisit);
router.get("/getRevisit",Revisitcontroller.getRevisit);
router.delete("/deleteRevisit/:Id",Revisitcontroller.deleteRevisit);

module.exports = router;