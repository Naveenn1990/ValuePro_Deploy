const jobPackageModel=require("../../Modal/venor/jobPackage");

class JobPackage{
    async AddJobpackage(req,res){
        try {
            let {totalJob,packageName,packageMinKm,packageMaxKm,packageDays,packageMinHr,price,commision}=req.body;
            let data=await jobPackageModel.create({totalJob,packageName,packageMinKm,packageMaxKm,commision,price,packageDays,packageMinHr});
            if(!data) return res.status(400).json({error:"Something went wrong"});
            return res.status(200).json({success:"Successfully added"});

        } catch (error) {
            console.log(error);
        }
    }

    async updateJobPackage(req,res){
        try {
            let {id,price,totalJob,packageName,packageMinKm,packageMaxKm,packageDays,packageMinHr,commision}=req.body;
            let obj={};
            if(price){
                obj["price"]=price
            }
            if(commision){
                obj["commision"]=commision
            }
            if(totalJob){
                obj["totalJob"]=totalJob
            }
            if(packageName){
                obj["packageName"]=packageName
            }
            if(packageMinKm){
                obj["packageMinKm"]=packageMinKm
            }
            if(packageMaxKm){
                obj["packageMaxKm"]=packageMaxKm
            }
            if(packageDays){
                obj["packageDays"]=packageDays
            }
            if(packageMinHr){
                obj["packageMinHr"]=packageMinHr
            }
          let data=await jobPackageModel.findOneAndUpdate({_id:id},{$set:obj},{new:true});
          if(!data) return res.status(400).json({error:"Data not found"});
          return res.status(200).json({success:"Successfully updated"})
        } catch (error) {
            console.log(error);
        }
    }
    
    async getAllJobsPackage(req,res){
        try {
            let data=await jobPackageModel.find().sort({price:1});
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }

    async getAllActiveJobsPackage(req,res){
        try {
            let data=await jobPackageModel.find({isActive:true}).sort({price:1});
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }
    async JobsPackageDelete(req,res){
        try {
            let id=req.params.id;
            let data=await jobPackageModel.deleteOne({_id:id});
            if(data.deletedCount==0) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:"Successfully deleted"})
        } catch (error) {
            console.log(error);
        }
    }
    
    async JobsPackageMakeActiveDeactive(req,res){
        try {
           let {id,isActive}=req.body;
            let data=await jobPackageModel.findOneAndUpdate({_id:id},{$set:{isActive:isActive}},{new:true});
            if(!data) return res.status(400).json({error:"Data not found"});
            if(data.isActive==true)  return res.status(200).json({success:"Successfully Activated"})
            return res.status(200).json({success:"Successfully Deactivated"})
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new JobPackage()