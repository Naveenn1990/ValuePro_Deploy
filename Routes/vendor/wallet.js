const express=require('express');
const router=express.Router();
const walletController=require("../../Controller/vendor/wallet");

router.post("/createWallet",walletController.createWallet);
router.put("/updateWallet",walletController.updateWallet);
router.put("/addTransaction",walletController.addTransaction);
router.delete("/deleteWallet/:vendorId",walletController.deleteWallet);
router.get("/getWalletByvendorId/:vendorId",walletController.getWalletByvendorId);
router.get("/allWalletOfdriver",walletController.getAllDriveWallet)

module.exports=router;