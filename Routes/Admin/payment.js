const express=require("express");
const router=express.Router();
const paymentController=require("../../Controller/Admin/payment");

router.post("/AddPayment",paymentController.AddPayment);
router.get("/getAllPayment",paymentController.getAllPayment);

module.exports=router;
