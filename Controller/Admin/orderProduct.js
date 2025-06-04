const orderModel=require("../../Modal/Admin/orderProduct");
const NotificationsModel = require("../../Modal/Admin/Notifications");
class Order{
    async AddorderProduct(req, res) {
        try {
          let {
            userId,
            userAddress,
            vendorId,
            vendorName,
            vendorMobile,
            TotalAmount,
            gst,
            discount,
            ProductData,
            payAmount, paymentStatus, payId, paymentMethod,vendorEmail
          } = req.body;
          let data = await orderModel.create({
            userId,
            vendorId,
            vendorName,
            vendorMobile,
            TotalAmount,
            gst,
            discount,
            userAddress,
            ProductData,
            payAmount, paymentStatus, payId, paymentMethod,vendorEmail
          });
      
          if (!data) return res.status(400).json({ error: "Something went wrong" });
          await NotificationsModel.create({title:"Order Place",userid:userId,Amount:TotalAmount,comment:` Your Order Place Successfully ${data?.vendorName} and Address ${data?.userAddress}`})
          return res.status(200).json({ success: "Successfully added" });
        } catch (error) {
          console.log(error);
        }
      }

    async updateOrder(req,res){
        try {
            let {userId,vendorId,vendorName,vendorMobile,TotalAmount,gst,discount,deliverStatus,deliveCharge,paymentStatus,paymentMethod,userAddress,deliverName,delivermobile,payId,payAmount}=req.body;
          
            if(userId){
                obj["userId"]=userId
            }
          
            if(vendorId){
                obj["vendorId"]=vendorId
            }
            if(vendorName){
                obj["vendorName"]=vendorName
            }
            if(vendorMobile){
                obj["vendorMobile"]=vendorMobile
            }
            if(TotalAmount){
                obj["TotalAmount"]=TotalAmount
            }
            // if(gst){
            //     obj["gst"]=gst
            // }
            // if(discount){
            //     obj["discount"]=discount
            // }
            if(deliverStatus){
                obj["deliverStatus"]=deliverStatus
            }
            if(deliveCharge){
                obj["deliveCharge"]=deliveCharge
            }
            if(paymentStatus){
                obj["paymentStatus"]=paymentStatus
            }
            if(paymentMethod){
                obj["paymentMethod"]=paymentMethod
            }

            if(userAddress){
                obj["userAddress"]=userAddress
            }
            if(deliverName){
                obj["deliverName"]=deliverName
            }
            if(delivermobile){
                obj["delivermobile"]=delivermobile
            }
            if(payId){
                obj["payId"]=payId
            }
            if(payAmount){
                obj["payAmount"]=payAmount
            }
          let data=await orderModel.findOneAndReplace({_id:id},{$set:obj},{new:true});
          if(!data) return res.status(400).json({error:"Data not found"});
          return res.status(200).json({success:"Successfully updated"})
        } catch (error) {
            console.log(error);
        }
    }
    async getAllOrders(req,res){
        try {
            let data=await orderModel.find().sort({_id:-1});
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }
    async getOrdersById(req,res){
        try {
            let id=req.params.id;
            let data=await orderModel.findById(id);
            if(!data) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }
    async assignOrdersDevelivery(req,res){
        try {
            let {id,deliverName,delivermobile,deliverStatus}=req.body;
            let data=await orderModel.findOneAndUpdate({_id:id},{$set:{deliverName,delivermobile,deliverStatus}},{new:true});
            if(!data) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }

    // async assignVendorRejectAndAccept(req,res){
    //     try {
    //         let {id,deliverName,delivermobile,deliverStatus}=req.body; 
    //         let data=await orderModel.findOne({_id:id,deliverStatus:"Accepted"});
    //         if(data) return res.status(400).json({error:"Already accepted"});
    //         let check=await orderModel.findOneAndUpdate({_id:id},{$set:{deliverName,delivermobile,deliverStatus}},{new:true});
    //         if(check.deliverStatus=="Accepted"){

    //         return res.status(200).json({success:"Successfully accepted"})
    //         }
    //         return res.status(200).json({success:"Successfully rejected"})
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


    
    async makeCompleteOrders(req,res){
        try {
            let {id,status}=req.body;

            let data=await orderModel.findOneAndUpdate({_id:id},{$set:{deliverStatus:status,status:status}});
            if(!data) return res.status(400).json({error:"Data not found"});
            await NotificationsModel.create({title:"Delivery Status",userid:userId,Amount:TotalAmount,comment:` Your Order Delivery ${data?.deliverStatus} and Address ${data?.userAddress}`})
            return res.status(200).json({success:"Successfully updated"})
        } catch (error) {
            console.log(error);
        }
    }

    async addProductVendor(req,res){
        try {
            let {id,productId,price,quntitity,name,actualPrice}=req.body; 
            let obj={productId,price,quntitity,name,actualPrice}
            let check=await orderModel.findById(id);
             if(!check) return res.status(400).json({error:"Data not found"});
            let am=check?.ProductData?.filter((ele)=>ele?.productId?.toString()==productId.toString());
            if(am.length!=0){
               
                check=  await orderModel.findOneAndUpdate({_id:id},{$pull:{ProductData:{productId:productId}}},{new:true})
            }
           
            check=await orderModel.findOneAndUpdate({_id:id},{$push:{ProductData:obj}},{new:true});
            let amount=Number(check?.serviceAmount)+Number(check?.ProductData?.reduce((a,item)=>a+item?.price,0))
            check=await orderModel.findOneAndUpdate({_id:id},{$set:{TotalAmount:amount}},{new:true});
           return res.status(200).json({success:check})
        } catch (error) {
            console.log(error);
        }
    }

    async removeProduct(req,res){
        try {
           let {id,productId,price}=req.body;
            let data=await orderModel.findOneAndUpdate({_id:id},{$pull:{ProductData:{productId:productId}}});
            if(!data) return res.status(400).json({error:"Data not found"});
            await orderModel.findOneAndUpdate({_id:id},{$set:{TotalAmount:Number(data?.TotalAmount)-Number(price)}})
            return res.status(200).json({success:"Successfully deleted"})
        } catch (error) {
            console.log(error);
        }
    }
    
    async getOrdersByVendorId(req,res){
        try {
            let id=req.params.id;
            let data=await orderModel.find({vendorId:id}).sort({_id:-1}).populate('ProductData.productId');
            return res.status(200).json({success:data})

        } catch (error) {
            console.log(error);
        }
    }

    async pouseOrdersReason(req,res){
        try {
           let {id,vendorAdvanceAm,reason,scheduleDate,scheduleTime}=req.body;
           let data=await orderModel.findOneAndUpdate({_id:id},{$set:{scheduleDate,scheduleTime,vendorAdvanceAm,reason,status:"Pause",VendorStatus:"Pouse"}});
           if(!data) return res.status(400).json({error:"Data not found"});
           return res.status(200).json({success:"Successfully uploaded"})

        } catch (error) {
            console.log(error);
        }
    }
    
    async makecheckOutOrder(req, res) {
        try {
          let { id, payAmount, paymentStatus, payId, paymentMethod } = req.body;
          let check =await orderModel.findById(id)
          if (!check) return res.status(400).json({ error: "Data not found" });
          let data = await orderModel.findOneAndUpdate(
            { _id: id },
            { $set: { payAmount:(check.payAmount+Number(payAmount)), paymentStatus, payId, paymentMethod } }
          );
          
          return res.status(200).json({ success: "SuccessFully paymrnt" });
        } catch (error) {
          console.log(error);
        }
      }
    async getuserById(req, res) {
        try {
          let user = req.params.id;
          let data = await orderModel.find({ userId: user });
          if (!data) return res.status(400).json({ error: "Data not found" });
          return res.status(200).json({ success: data });
        } catch (error) {
          console.log(error);
        }
      }

      async makecancelOrder(req,res){
        try {
            let id=req.params.id;
            let data=await orderModel.findOneAndUpdate({_id:id},{$set:{status:"Cancel",deliverStatus:"Cancel"}});
            if(!data) return res.status(400).json({error:"Data Not Found"});
            return res.status(200).json({success:"Successfully cancel order"})
        } catch (error) {
            console.log(error);
        }
      }
      async Deliverystatusupdate(req, res) {
     const id= req.params.id;
     let {deliverStatus}=req.body;
     console.log(deliverStatus,"deliverStatus")
    try {  
          const Statuschange  = await orderModel.findByIdAndUpdate(
            { _id: id},
            { $set: { deliverStatus: deliverStatus} },
            { new: true }
          );
         
            return res.status(200).json({ success: "Status Updated" });
        
        }
     catch (error) {
      return res.status(400).json({ error: "Something is wrong..!!" });
    }
      }

}
module.exports=new Order();