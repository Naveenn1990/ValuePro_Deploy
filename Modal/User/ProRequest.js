const mongoose =require ("mongoose");
const Schema = mongoose.Schema;

const Prorequest = new Schema(
    {
        PName:{
            type:String
        },
        PEmail:{
            type:String
        },
        PNumber:{
            type:String
        },
        PType:{
            type:String
        },
        PMessage:{
            type:String
        },
        status: {
        type: String,
        default: "Pending",
    },
    },{timestamps:true}
)

module.exports = mongoose.model("Prorequest",Prorequest);
