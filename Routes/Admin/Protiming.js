const express = require("express");
const router = express.Router();
const Protimingcontroller = require("../../Controller/Admin/Protiming");

router.post("/addProtiming", Protimingcontroller.addProtiming);
router.put("/editProtiming", Protimingcontroller.editProtiming);
router.get("/getProtiming", Protimingcontroller.getProtiming);
router.delete("/deleteProtiming/:id", Protimingcontroller.deleteProtiming);

module.exports = router;
