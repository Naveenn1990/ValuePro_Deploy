const express = require("express");
const router = express.Router();
const multer = require("multer");
const vendorController = require("../../Controller/vendor/vendor");
const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "Public/Vendor");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer();

router.post("/registerVendor", upload.any(), vendorController.registerVendor);
router.put("/UpdateVender", upload.any(), vendorController.UpdateVender);
router.post("/vendorLogin", vendorController.vendorLogin);
router.put("/makeBlockUnblockVendor", vendorController.makeBlockUnblockVendor);
router.put(
  "/makeApproveAndHoldVendor",
  vendorController.makeApproveAndHoldVendor
);
router.get("/getAllVendors", vendorController.getAllVendors);
router.get("/getVendorById/:id", vendorController.getVendorById);
router.put(
  "/UpdateBankDetailsVendor",
  vendorController.UpdateBankDetailsVendor
);
router.put("/UpdateCommisionVendor", vendorController.UpdateCommisionVendor);
router.put("/updateLocationVendor", vendorController.updateLocationVendor);
router.put("/makeAssignedHubVendor",vendorController.makeAssignedHubVendor);
router.put("/addRating", vendorController.addRating);
router.put("/MarkTimeOnOfVendor",vendorController.MarkTimeOnOfVendor);
router.put("/updatevendortoken",vendorController.updatevendortoken);
module.exports = router;
