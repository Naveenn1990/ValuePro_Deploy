const express = require("express");
const router = express.Router();
const Offerscontroller = require("../../Controller/Admin/Offers1");

router.post("/addOffers", Offerscontroller.addOffers);
router.post("/editOffers", Offerscontroller.editOffers);
router.get("/getOffers", Offerscontroller.getOffers);
router.post("/deleteOffers/:id", Offerscontroller.deleteOffers);

module.exports = router;
