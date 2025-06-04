const mongoose=require('mongoose');

const commissionSchema=new mongoose.Schema({
    seramt:{
        type:Number,
        default:0
    },
     productpr:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model("commission",commissionSchema);