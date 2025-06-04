const mongoose=require('mongoose');

const referralAmSchema=new mongoose.Schema({
    amount:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model("reffrel",referralAmSchema);