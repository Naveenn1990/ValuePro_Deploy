const authController = require("../../Controller/User/user");
const express = require("express");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signinwithphone", authController.signinwithphone);
router.post("/otpVarification", authController.otpVarification);
router.get("/alluser", authController.alluser);
router.put("/edituser", authController.edituser);
router.put("/makeBlockUnblockUser",authController.makeBlockUnblockUser);
router.put("/updatemobilefcmtoken", authController.updatemobilefcmtoken);
router.put("/updatewebfcmtoken", authController.updatewebfcmtoken);
router.delete("/delete/:id", authController.userDelete);
module.exports = router;
