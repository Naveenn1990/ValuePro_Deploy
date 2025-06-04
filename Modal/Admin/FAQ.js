const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const FAQ = new Schema(
    {
        question:{
            type:String,
        },
        answer:{
            type:String,
        },
       
    },
    {timestamps:true}
)

const FAQModel = mongoose.model("FAQ",FAQ);
module.exports = FAQModel;