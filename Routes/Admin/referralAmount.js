const express=require("express");
const router=express.Router();

const referralController=require("../../Controller/Admin/referralAmount");

router.post("/addAndUpateReferral",referralController.addAndUpateReferral);
router.get("/getReferral",referralController.getReferral);

module.exports=router;