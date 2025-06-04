const { uploadFile2 } = require("../../Config/AWS");
const AboutModel = require("../../Modal/Admin/About");

class About {
  async addAbout(req, res) {
    try {
      let { abtheader, abtdesc } = req.body;
      if(req.files?.length<0) return res.status(400).json({ message: "Please select an image" });
      let file =await uploadFile2(req.files[0],"about");
      let file1 =await uploadFile2(req.files[1],"about");


      let NewAbout = new AboutModel({
        abtheader,
        abtimg: file,
        abticon: file1,
        abtdesc,
      });
      NewAbout.save().then((data) => {
        return res.status(200).json({ success: "About added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAbout(req, res) {
    try {
      let About = await AboutModel.find({});
      if (About) {
        return res.status(200).json({ About: About });
      } else {
        return res.status(403).json({ error: "No About exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAbout(req, res) {
    try {
      let id = req.params.id;

      await AboutModel.findOneAndDelete({ _id: id })
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

  // async editAbout(req, res) {
  //   try {
  //     let { id, abtheader, abtdesc } = req.body;
  //     let obj = { abtheader, abtdesc };
  //     if (req?.files?.length != 0) {
  //       let arr = req.files;
  //       let i;
  //       for (i = 0; i < arr?.length; i++) {
  //         if (arr[i].fieldname == "abtimg") {
  //           obj["abtimg"] = arr[i].filename;
  //         }
  //       }
  //       for (i = 0; i < arr?.length; i++) {
  //         if (arr[i].fieldname == "abticon") {
  //           obj["abticon"] = arr[i].filename;
  //         }
  //       }
  //       if (abtheader) {
  //         obj["abtheader"] = abtheader;
  //       }
  //       if (abtdesc) {
  //         obj["abtdesc"] = abtdesc;
  //       }
  //     }

  //     let updateAbout = await AboutModel.findOneAndUpdate(
  //       { _id: id },
  //       { $set: obj },
  //       { new: true }
  //     );

  //     if (updateAbout) {
  //       return res.status(200).json({
  //         success: "Details Updated successfully",
  //         About: updateAbout,
  //       });
  //     } else {
  //       return res.status(500).json({ error: "cannot able to do" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async editAbout(req, res) {
    try {
      let { id, abtheader, abtdesc } = req.body;
    // console.log("check data",id, abtheader, abtdesc)
      let obj = {};

      if (req?.files?.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "abtimg") {
            obj["abtimg"] =await uploadFile2(arr[i],"about");
          }
            if (arr[i].fieldname == "abticon") {
            obj["abticon"] =await uploadFile2(arr[i],"about");
          }
        }
      }
       
        if (abtheader) {
          obj["abtheader"] = abtheader;
        }
        if (abtdesc) {
          obj["abtdesc"] = abtdesc;
        }
      

      let updateAbout = await AboutModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateAbout) {
        return res.status(200).json({
          success: "Details Updated successfully",
          About: updateAbout,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Aboutcontroller = new About();
module.exports = Aboutcontroller;
