const express=require("express");
const router=express.Router();
const LeaveModel = require("../../Controller/Admin/Leave");

router.post("/addvendorleave",LeaveModel.addvendorleave);
router.get("/getvendorleave",LeaveModel.getvendorleave)
router.put("/makeChangevendorLeave",LeaveModel.makeChangevendorLeave);
router.put("/makeApproveleave",LeaveModel.makeApproveleave);
router.delete("/deletevendorLeave",LeaveModel.deletevendorLeave);
router.put("/adminreason",LeaveModel.makeadmireason);
router.get("/getvendorleavebyid/:id",LeaveModel.getvendorleavewithId)
module.exports=router;