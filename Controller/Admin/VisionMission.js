const VisionMissionModel = require("../../Modal/Admin/VisionMission");

class VisionMission{
    async addVisionMission(req, res) {
        try {
          let {
            visionMission,
            WhatWeDo,
          } = req.body;
          let NewVisionMission = new VisionMissionModel({
            visionMission,
            WhatWeDo,
          });
          // console.log("NewAddress", NewAddress);
          NewVisionMission.save().then((data) => {
            return res.status(200).json({ success: "Added Successfully" });
          });
        } catch (error) {
          console.log(error);
        }
      }

    async getAllVisionMission(req,res){
        try {
            let data=await VisionMissionModel.find();
            return res.status(200).send({success:data})
        } catch (error) {
           console.log(error); 
        }
    }

    async deleteVisionMission(req, res) {
      try { 
       let remove = req.params.id;
    
         await VisionMissionModel.findOneAndDelete({ _id: remove })
           .then((data) => {
             return res.json({ Success: "Removed Successfully" });
           })
           .catch((err) => {
             return res.status({ error: "Something went wrong" });
           });
       } catch (error) {
         console.log(error);
       }
     }

    async editVisionMission(req, res) {
        let { id,  visionMission,WhatWeDo, } = req.body;
        let obj = { };
        if (req?.files?.length != 0) {
          let arr = req.files;
          let i;
          // for (i = 0; i < arr?.length; i++) {
            // if (arr[i].fieldname == "img") {
            //   obj["img"] = arr[i].filename;
            // }
          // }
            if(visionMission){
              obj["visionMission"] = visionMission;
            }
            if(WhatWeDo){
              obj["WhatWeDo"] = WhatWeDo;
            }
          
        }
        try {
          let updateVisionMission = await VisionMissionModel.findOneAndUpdate(
            { _id: id },
            { $set: obj },
            { new: true }
          );
    
          if (updateVisionMission) {
            return res.status(200).json({
              success: "Details updated successfully",
              VisionMission: updateVisionMission,
            });
          } else {
            return res.status(500).json({ error: "Something went wrong" });
          }
        } catch (error) {
          console.log(error);
        }
      }
}

module.exports = new VisionMission();