const mongoose=require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;

const SuscribeSchema=new mongoose.Schema({
    vendorId:{
        type:ObjectId,
        ref:"vendor"
    },
    PaymentId:{
        type:String,
      
    },
    SubscriptionId:{
        type:ObjectId,
        ref:"jobpackage"
      
    },
    totalJob:{
        type:Number,
        default:0
    },
    packageMinKm:{
        type:Number,
        default:0
    },
    packageMaxKm:{
        type:Number,
        default:0
    },
    packageDays:{
        type:Number,
        default:0
    },
    packageMinHr:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    commission:{
        type:Number,
        default:0
    },
    startDate:{
        type:String
    },
    endDate:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true});
module.exports=mongoose.model("Subscribevendor",SuscribeSchema);