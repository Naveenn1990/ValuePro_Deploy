const mongoose =require ("mongoose");
const Schema = mongoose.Schema;

const Revisit = new Schema(
    {
        CustName:{
            type:String
        },
        CustEmail:{
            type:String
        },
        CustNumber:{
            type:String
        },
        CustType:{
            type:String
        },
        CustDate:{
            type:String
        },
        CustTime:{
            type:String
        },
       
    },{timestamps:true}
)

module.exports = mongoose.model("Revisit",Revisit);
