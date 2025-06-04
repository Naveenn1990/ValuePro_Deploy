const express=require("express");
const router=express.Router();
const orderController=require("../../Controller/Admin/orderProduct");

router.post("/AddorderProduct",orderController.AddorderProduct);
router.put("/updateOrder",orderController.updateOrder);
router.get("/getAllOrders",orderController.getAllOrders);
router.get("/getOrdersById/:id",orderController.getOrdersById)
router.put("/assignOrdersDevelivery",orderController.assignOrdersDevelivery);
// router.put("/assignVendorRejectAndAccept",orderController.assignVendorRejectAndAccept);
router.put("/makeCompleteOrders",orderController.makeCompleteOrders);
// router.put("/makeCompleteJobs",orderController.makeCompleteJobs);
router.put("/addProductOrder",orderController.addProductVendor);
router.put("/removeProductOrder",orderController.removeProduct);
router.get("/getOrdersByVendorId/:id",orderController.getOrdersByVendorId);

router.put("/makecheckOutOrder/",orderController.makecheckOutOrder);
router.put("/makecancelOrder/:id",orderController.makecancelOrder);
router.get("/getOrderUserbyid/:id", orderController.getuserById);
router.put("/updateorderstatus/:id",orderController.Deliverystatusupdate);
module.exports=router;