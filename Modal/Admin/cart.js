const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const Cart = new Schema(
    {
        vendorId:{
            type:ObjectId,
            ref:"vendor"
        },
    
          productId: {
            type: ObjectId,
            ref: "product",
          },
          productName: {
            type: String,
           
          },
          quantity: {
            type: Number,
            default: 1,
          },
          
          price:{
              type: Number,
              default: 0,
          },

      
          totalPrice: { type: Number },
        
       
    }

);
module.exports=mongoose.model("Cart",Cart)