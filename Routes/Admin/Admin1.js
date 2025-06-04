const express = require("express");
const router = express.Router();
const adminauthontroller = require("../../Controller/Admin/Admin1");

router.post("/signup", adminauthontroller.AdminSignup);
router.post("/addsubadmin", adminauthontroller.addsubadmin);
router.post("/editsubadmin", adminauthontroller.editsubadmin);
router.post("/editsubadminaccess", adminauthontroller.editsubadminaccess);
router.post("/signin", adminauthontroller.Postadminlogin);
router.get("/signout/:adminid", adminauthontroller.adminSignout);
router.get("/getallsubadmin", adminauthontroller.getallsubadmin);
router.post("/deletesubadmin/:id", adminauthontroller.postdeletesubadmin);
// router.post("/sendmail", adminauthontroller.sendMail)
// router.post("/otpverification", adminauthontroller.Otpverification)
// router.put('/newpassword', adminauthontroller.NewPassword)

module.exports = router;
