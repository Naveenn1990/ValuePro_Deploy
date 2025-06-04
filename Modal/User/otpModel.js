const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Schema.Types.ObjectId;

const otpSchema = new Schema({
    
    phone: {
        type: String
    },
    otp:{
        type: Number
    }
    
},{timestamps:true});

const otpModel = mongoose.model('Otp', otpSchema);
module.exports = otpModel;