const paymentModel=require("../../Modal/Admin/payment");

class Payment{
    async AddPayment(req,res){
        try {
            let {vendorId,userId,jobId,payId,amount,status}=req.body;
            let data=await paymentModel.create({vendorId,jobId,payId,amount,status,userId});
            if(data.status=="Cr") return res.status(200).json({success:"Successfully create"});
            return res.status(200).json({success:"Successfully debited"})
        } catch (error) {
            console.log(error);
        }
    }

    async getAllPayment(req,res){
        try {
           let data=await paymentModel.find().sort({_id:-1});
           return res.status(200).json({success:data});
        } catch (error) {
            console.log(error);
        }
    }

 }
 module.exports=new Payment();