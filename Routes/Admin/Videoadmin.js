const express=require("express");
const router=express.Router();

const videoController=require("../../Controller/Admin/Videoadmin");
const multer=require("multer");
const storage=multer.diskStorage({
    destination:function(req,file,cd){
        cd(null,"Public/Video")
    },
    filename:function(req,file,cd){
        cd(null,Date.now()+"_"+file.originalname);
    }
});
const upload=multer();

router.post("/createvideo", upload.any(), videoController.AddVideo);
router.get("/getvideo",videoController.getVideo);
router.put("/updatevideo/:id", upload.any(), videoController.updateVideo);


module.exports=router;