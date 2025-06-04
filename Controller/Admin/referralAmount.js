const referralModel=require("../../Modal/Admin/referralAmount");

class Referral{
async addAndUpateReferral(req,res){
    try {
        let {amount}=req.body;
        if(!amount) return res.status(400).json({error:"Please enter amount"});
        let data=await referralModel.findOne();
        if(data){
            await referralModel.findOneAndUpdate({_id:data?._id},{$set:{amount:amount}});
        
        }else{
            await referralModel.create({amount})
        } 
        return res.status(200).json({success:"Successfully added"})
    } catch (error) {
        console.log(error);
    }
}

async getReferral(req,res){
    try {
        let data=await referralModel.find();
        return res.status(200).json({success:data})
    } catch (error) {
        console.log(error);
    }
}

}
module.exports=new Referral();