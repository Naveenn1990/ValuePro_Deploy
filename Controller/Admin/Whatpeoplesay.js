const { uploadFile2 } = require("../../Config/AWS");
const WhatpeoplesayModel = require("../../Modal/Admin/WhatPeopleSay");

class Whatpeoplesay {
  async addWhatpeoplesay(req, res) {
    try {
      let { Header9, desc9 } = req.body;
      let file = await uploadFile2(req.files[0],"people");

      let NewWhatpeoplesay = new WhatpeoplesayModel({
        Header9,
        img9: file,
        desc9,
      });
      NewWhatpeoplesay.save().then((data) => {
        return res
          .status(200)
          .json({ success: "Whatpeoplesay added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getWhatpeoplesay(req, res) {
    try {
      let Whatpeoplesay = await WhatpeoplesayModel.find({});
      if (Whatpeoplesay) {
        return res.status(200).json({ Whatpeoplesay: Whatpeoplesay });
      } else {
        return res.status(403).json({ error: "No Whatpeoplesay exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteWhatpeoplesay(req, res) {
    try {
      let id = req.params.id;

      await WhatpeoplesayModel.findOneAndDelete({ _id: id })
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

  async editWhatpeoplesay(req, res) {
    try {
      let { id, Header9, desc9 } = req.body;
      console.log("ckeckdtaaa",id, Header9, desc9)
      let obj = {};
      if (req.files && req.files.length > 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "img9") {
            obj["img9"] = await uploadFile2(arr[i],"people");
          }
        }
      }
        if (Header9) {
          obj["Header9"] = Header9;
        }
        // if (title9) {
        //   obj["title9"] = title9;
        // }
        if (desc9) {
          obj["desc9"] = desc9;
        }
     
     
      let updateWhatpeoplesay = await WhatpeoplesayModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateWhatpeoplesay) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Whatpeoplesay: updateWhatpeoplesay,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Whatpeoplesaycontroller = new Whatpeoplesay();
module.exports = Whatpeoplesaycontroller;
