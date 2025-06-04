const walletModel=require("../../Modal/venor/wallet");
const NotificationsModel = require("../../Modal/Admin/Notifications");
class Wallet{
 async createWallet(req,res){
    try {
        let {vendorName,mobile,vendorId,totalAmount}=req.body;
        let obj={vendorName,mobile,vendorId,totalAmount}
        let check=await walletModel.findOne({vendorId:vendorId});
        if(!check){
              let data =await walletModel.create(obj);
        if(!data) return res.status(400).json({error:"Something went wrong"});
        return res.status(200).json({success:data})
        }else{
            return res.status(400).json({error:"Already created wallet"});
        }

    } catch (error) {
       console.log(error); 
    }
 }
 async updateWallet(req,res){
    try {
        let {vendorName,mobile,vendorId,totalAmount,walletId}=req.body;
        let obj={vendorName,mobile,vendorId,totalAmount}
        let data=await walletModel.findOneAndUpdate({_id:walletId},{$set:obj},{new:true})
        if(!data) return res.status(400).json({error:"Something went worng"});
        return res.status(200).json({success:"Successfully updated"})
    } catch (error) {
        console.log(error);
    }
 }
 async addTransaction(req,res){
    try {
        let {vendorId,title,AcNo,payId,amount,status}=req.body;
     if(!status) return res.status(400).json({error:"Please give status"})
        status=status.toUpperCase()
        let obj={title,AcNo,payId,amount,status}
        if(status=="CR"|| status=="DR"){

            let data=await walletModel.findOneAndUpdate({vendorId:vendorId},{$push:{transaction:obj}},{new:true})
            if(!data)return res.status(400).json({error:"Something went wrong"});
            if(status==="CR"){
                await walletModel.findOneAndUpdate({vendorId:vendorId},{$set:{totalAmount:Number(data.totalAmount)+Number(amount)}},{new:true})
                await NotificationsModel.create({title:"Wallet",userid:vendorId,Amount:amount,comment:`₹ Wallet credit ${data?.vendorName}`})
                return res.status(200).json({success:"Successfully creadit your wallet"})
            }else if(status==="DR"){
                await walletModel.findOneAndUpdate({vendorId:vendorId},{$set:{totalAmount:Number(data.totalAmount)-Number(amount)}},{new:true})
                await NotificationsModel.create({title:"Wallet",userid:vendorId,Amount:amount,comment:`₹ Wallet debit ${data?.vendorName}`})
                return res.status(200).json({success:"Successfully debit your wallet"})
            }
        }
        return res.status(400).json({error:"Please enter status shuld be Cr or Dr"})
    } catch (error) {
        console.log(error);
    }
 }
 async deleteWallet(req,res){
    try{
        let vendorId=req.params.vendorId
        let data =await walletModel.deleteOne({vendorId:vendorId})
        if(data.deletedCount==0) return res.status(400).json({error:"Data not found"});
        return res.status(200).json({success:"Successfully deleted"});
    }catch(error){
        console.log(error);
    }
 }
  async getWalletByvendorId(req,res){
    try {
        let vendorId=req.params.vendorId
        let data=await walletModel.findOne({vendorId:vendorId});
        if(!data) return res.status(400).json({error:"Something went wrong"});
        return res.status(200).json({success:data})
    } catch (error) {
        console.log(error);
    }
  }
  async getAllDriveWallet(req,res){
    try {
       
        let data=await walletModel.find({}).sort({_id:-1});
        // if(!data) return res.status(400).json({error:"Something went wrong"});
        return res.status(200).json({success:data})
    } catch (error) {
        console.log(error);
    }
  }
}
module.exports=new Wallet();