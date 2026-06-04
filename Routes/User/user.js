const authController = require("../../Controller/User/user");
const express = require("express");
const router = express.Router();

// Old direct signup is DISABLED — use sendSignupOtp + verifySignupOtp instead
// router.post("/signup", authController.signup);
router.post("/sendSignupOtp", authController.sendSignupOtp);
router.post("/verifySignupOtp", authController.verifySignupOtp);
router.post("/signinwithphone", authController.signinwithphone);
router.post("/otpVarification", authController.otpVarification);
router.get("/alluser", authController.alluser);
router.put("/edituser", authController.edituser);
router.put("/makeBlockUnblockUser",authController.makeBlockUnblockUser);
router.put("/updatemobilefcmtoken", authController.updatemobilefcmtoken);
router.put("/updatewebfcmtoken", authController.updatewebfcmtoken);
router.delete("/delete/:id", authController.userDelete);
module.exports = router;
