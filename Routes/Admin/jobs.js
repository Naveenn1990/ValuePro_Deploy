const express=require("express");
const router=express.Router();
const multer=require("multer");
const jobsController=require("../../Controller/Admin/jobs");
const commissionController = require("../../Controller/Admin/commission")

const storage=multer.diskStorage({
    destination:function (req,file,cd){
        cd(null,"Public/Chat");
    },
    filename:function (req,file,cd){
        cd(null,Date.now()+"_"+file.originalname);
    }
})

const upload=multer(); 
router.post("/AddJobsService",jobsController.AddJobsService);
router.put("/updateJobs",jobsController.updateJobs);
router.get("/getAllJobs",jobsController.getAllJobs);
router.get("/getJobsById/:id",jobsController.getJobsById)
router.put("/assignVendorJobs",jobsController.assignVendorJobs);
router.put("/assignVendorRejectAndAccept",jobsController.assignVendorRejectAndAccept);
router.put("/MakeCancelAssigendVendor",jobsController.MakeCancelAssigendVendor);
router.put("/makeCompleteJobs",jobsController.makeCompleteJobs);
router.put("/addProductVendor",jobsController.addProductVendor);
router.put("/removeProduct",jobsController.removeProduct);
router.put("/addServiceVendor",jobsController.addServiceVendor);
router.put("/removeService",jobsController.removeService);
router.get("/getJobsByVendorId/:id",jobsController.getJobsByVendorId);
router.put("/uploadFourImageStartJob",upload.any(),jobsController.uploadFourImageStartJob);
router.put("/uploadFourImageHandOverJob",upload.any(),jobsController.uploadFourImageHandOverJob);
router.put("/pouseJobsReason",jobsController.pouseJobsReason);
router.put("/notworkingreason",jobsController.notworkingreason);
router.put("/makecheckOutJobs",jobsController.makecheckOutJobs);
router.get("/getUserbyid/:id", jobsController.getuserById);
router.put("/CreateCotisonFromVendor",jobsController.CreateCotisonFromVendor)
router.put("/makecotision",jobsController.makecotision);
router.put("/rejectcotision",jobsController.rejectcotision);
router.post("/jobWarranty",jobsController.jobWarranty);
router.post("/assignnewjobArea",jobsController.assignnewjobArea);
router.get("/getAlertJobsByVendor/:id",jobsController.getAlertJobsByVendor)
router.put("/addRating",jobsController.addRating);
router.put("/makeCancelJobByUser",jobsController.makeCancelJobByUser);
router.get("/getJobsByVendorIdLastDay/:id",jobsController.getJobsByVendorIdLastDay);
router.get("/getAllAssignedJobCaleceForVendor/:id",jobsController.getAllAssignedJobCaleceForVendor);
router.put("/MakeRevisit",jobsController.revisitJob);
router.put("/updatecomission", jobsController.updatecomission);
router.post('/addcommission',commissionController.addCommission);
router.get('/getcommission',commissionController.getCommission);
router.put('/updatecommission/:id',commissionController.updateCommission);


module.exports=router;