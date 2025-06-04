const mongoose=require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId;

const paymentSchema=new mongoose.Schema({
    vendorId:{
        type:ObjectId,
        ref:"vendor"
    },
    userId:{
        type:String
    },
    jobId:{
        type:ObjectId,
        ref:"jobs"
    },
    payId:{
        type:String
    },
    amount:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:"Pending"
    }
},{timestamps:true});
module.exports=mongoose.model("payment",paymentSchema);