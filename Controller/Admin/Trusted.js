const { uploadFile2 } = require("../../Config/AWS");
const TrustedModel = require("../../Modal/Admin/Trusted");

class Trusted {
  async addTrusted(req, res) {
     try {
    let { img } = req.body;
    let file =  await uploadFile2(req.files[0],"trust");
   
      let NewTrusted = new TrustedModel({
        img: file,
      });
      NewTrusted.save().then((data) => {
        return res.status(200).json({ success: "Trusted partner added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getTrusted(req, res) {
    try {
      let Trusted = await TrustedModel.find({});
      if (Trusted) {
        return res.status(200).json({ Trusted: Trusted });
      } else {
        return res.status(403).json({ error: "No Trusted exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTrusted(req, res) {
   try { 
    let remove = req.params.id;

      await TrustedModel.findOneAndDelete({ _id: remove })
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

  async editTrusted(req, res) {
      try {
    let { id,img} = req.body;
    let obj = {};
    if (req?.files?.length != 0) {
      let arr = req.files;
      let i;
      for (i = 0; i < arr?.length; i++) {
        if (arr[i].fieldname == "img") {
          obj["img"] =await uploadFile2(arr[i],"trust");
        }
      }
    }
  
      let updateTrusted = await TrustedModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateTrusted) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Trusted: updateTrusted,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Trustedcontroller = new Trusted();
module.exports = Trustedcontroller;
