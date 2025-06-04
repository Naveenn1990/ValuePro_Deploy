const express=require('express');
const router=express.Router();

const JobPackageController=require("../../Controller/vendor/jobPackage");

router.post("/AddJobpackage",JobPackageController.AddJobpackage);
router.put("/updateJobPackage",JobPackageController.updateJobPackage);
router.get("/getAllJobsPackage",JobPackageController.getAllJobsPackage);
router.get("/getAllActiveJobsPackage",JobPackageController.getAllActiveJobsPackage);
router.delete("/JobsPackageDelete/:id",JobPackageController.JobsPackageDelete);
router.put("/JobsPackageMakeActiveDeactive",JobPackageController.JobsPackageMakeActiveDeactive);
module.exports=router;