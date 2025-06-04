const expanse=require("express");
const router=expanse.Router();

const subscribeController=require("../../Controller/vendor/Susbscribe");

router.post("/AddSubCribe",subscribeController.AddSubCribe);
router.get("/getAllSubscribe",subscribeController.getAllSubscribe);
router.get("/getAllSubscribeByVendorId/:id",subscribeController.getAllSubscribeByVendorId);
router.get("/getActiveSubscribeByVendorId/:id",subscribeController.getActiveSubscribeByVendorId);
router.put("/makeActiveAndDeactive",subscribeController.makeActiveAndDeactive);

module.exports=router;