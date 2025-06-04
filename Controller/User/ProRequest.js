const ProrequestModel = require("../../Modal/User/ProRequest");

class Prorequest{
    async addProrequest(req,res){
        try {
            let {PName,PEmail,PNumber,PType,PMessage} = req.body;
            let NewProrequest = new ProrequestModel({
                PName,
                PEmail,
                PNumber,
                PType,
                PMessage,
            })
            NewProrequest.save().then((data)=>{
                return res.status(200).json({success:"Added Successfully"})
            })
        } catch (error) {
            
        }
    }
    // async getProrequest(req,res){
    //     try {
    //         let id=req.params.id;
    //         let data=await ProrequestModel.find({_id:id});
    //         if(data){
    //             return res.status(200).json({success:data})
    //         } else{
    //             return res.status(400).json({error:"Data Cannot be added"})
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async getProrequest(req,res){
        try {
            let data=await ProrequestModel.find();
            return res.status(200).send({success:data})
        } catch (error) {
            console.log(error);
        }
      }
    async deleteProrequest(req,res){
        try {
            let id = req.params.id;
            console.log(id,"checkdata")
            let data = await ProrequestModel.deleteOne({_id:id});
            return res.status(200).json({success:"Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    }
     async makeApproveAndHoldVendor(req, res) {
    try {
      let { id, status } = req.body;
      let data = await ProrequestModel.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } },
        { new: true }
      );

      if (!data) return res.status(400).json({ error: "Data not found" });
      if (data?.status == "Approved")
        return res.status(200).json({ success: "Successfully Approved" });
      return res.status(200).json({ success: "Successfully Hold" });
    } catch (error) {
      console.log(error);
    }
  }
    
    async editProre(req, res) {
        let { id,PName,
                PEmail,
                PNumber,
                PType,
                PMessage, } = req.body;
        let obj = { };
        if (req?.files?.length != 0) {
          let arr = req.files;
          let i;
          // for (i = 0; i < arr?.length; i++) {
            // if (arr[i].fieldname == "img") {
            //   obj["img"] = arr[i].filename;
            // }
          // }
            if(PName){
              obj["PName"] = PName;
            }
            if(PEmail){
              obj["PEmail"] = PEmail;
            }
             if(PNumber){
              obj["PNumber"] = PNumber;
            }
            if(PType){
              obj["PType"] = PType;
            }
          if(PMessage){
              obj["PMessage"] = PMessage;
            }
        }
        try {
          let updateVisionMission = await ProrequestModel.findOneAndUpdate(
            { _id: id },
            { $set: obj },
            { new: true }
          );
    
          if (updateVisionMission) {
            return res.status(200).json({
              success: "Details updated successfully",
             
            });
          } else {
            return res.status(500).json({ error: "Something went wrong" });
          }
        } catch (error) {
          console.log(error);
        }
      }
}

module.exports = new Prorequest();