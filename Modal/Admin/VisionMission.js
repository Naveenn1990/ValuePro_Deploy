const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const VisionMission = new Schema(
    {
        visionMission:{
            type:String,
        },
        WhatWeDo:{
            type:String,
        },
    },
    {timestamps:true}
)

const VisionMissionModel = mongoose.model("VisionMission_WhatWeDo",VisionMission);
module.exports = VisionMissionModel;