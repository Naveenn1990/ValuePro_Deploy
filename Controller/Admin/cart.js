const cartModel=require("../../Modal/Admin/cart");
class cart{
    async addToCart(req,res){
        try {
            let {vendorId,productId,productName,quantity,price,totalPrice}=req.body;
            let data=await cartModel.findOne({vendorId:vendorId,productId:productId});
            if(data) return res.status(400).json({error:"Product already exits in cart"});
             await  cartModel.create({productName,quantity,price,totalPrice,productId,vendorId})
            return res.status(200).json({success:"Successfully added"})

        } catch (error) {
            console.log(error);
        }
    }
    async getAllCartProductsByVender(req, res){
        try{
            const vendorId = req.params.id;
            const cartProducts = await cartModel.find({vendorId: vendorId}).sort({_id:-1}).populate("productId");
            const data = await cartModel.find({vendorId: vendorId}).sort({_id:-1})
            // if(cartProducts.length ===0){
            //     return res.status(400).json({error: "Your cart is empty"});
            // }
            return res.status(200).json({msg: "Here is the list of products in your cart: ", success: cartProducts,data:data});
        }catch(error){
            console.log(error);
        }
    }
    async DeleteAllCartProductsByVender(req, res){
        try{
            const vendorId = req.params.id;
            const cartProducts = await cartModel.deleteMany({vendorId: vendorId})
            // const data = await customerCartModel.find({customerId: customerId}).sort({_id:-1})
            // if(cartProducts.length ===0){
            //     return res.status(400).json({error: "Your cart is empty"});
            // }
            return res.status(200).json({msg: "Successfully deleted",success: cartProducts});
        }catch(error){
            console.log(error);
        }
    }
    async removeInCartOfVender(req,res){
        try {
            // let {vendorId,}=req.body;
            let productId=req.params.productId
            let vendorId=req.params.vendorId
            let data= await cartModel.deleteOne({vendorId:vendorId,productId:productId});
            if(data.deletedCount==0) return res.status(400).json({error:"Data not found"});
             console.log(productId,vendorId,'hh');
            return res.status(200).json({success:"Successfully deleted"})
        } catch (error) {
            console.log(error);
        }
    }
    async priceIncAnddec(req,res){
        try {
            let {cartId,quantity,totalPrice}=req.body
            let data= await cartModel.findOneAndUpdate({_id:cartId},{$set:{quantity,totalPrice}},{new:true});
            if(!data) return res.status(400).json({error:"Something went wrong!"});
            return res.status(200).json({success:"Success"})
        } catch (error) {
            console.log(error);
        }
    }
    async deleteCartVendor(req,res){
        try {
            let id=req.params.id
            let data =await cartModel.deleteMany({vendorId:id});
            return res.status(200).json({success:"Successfully delete"})
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new cart();