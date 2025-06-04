const mongoose = require('mongoose');

const ContactPageSchema=new mongoose.Schema({
  Name:{
    type:String
  },
  Adress:{
    type:String
   },
   email:{
    type:String
   },
   mobile:{
    type:String
   },
});
module.exports=mongoose.model("ContactPage",ContactPageSchema);