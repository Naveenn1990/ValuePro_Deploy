const mongoose=require('mongoose');

const videoadmin = new mongoose.Schema({
    video:{
        type:String,
    }
});
module.exports=mongoose.model("videos",videoadmin);