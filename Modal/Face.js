const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;

const faceSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref:"vendor",
    required: true,
    unique: true,
  },
  faceDescriptor:[mongoose.Schema.Types.Mixed],
  image:{
    type:String
  },
  // You can add more fields like user name, metadata, etc. as needed
},{timestamps:true});

const FaceModel = mongoose.model('Face', faceSchema);

module.exports = FaceModel;