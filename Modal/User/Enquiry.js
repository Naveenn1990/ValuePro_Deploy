const mongoose =require ("mongoose");
const Schema = mongoose.Schema;

const enquiry = new Schema(
    {
        EName:{
            type:String
        },
        Email:{
            type:String
        },
        Number:{
            type:String
        },
        Message:{
            type:String
        }
    },{timestamps:true}
)

module.exports = mongoose.model("enquiry",enquiry);
