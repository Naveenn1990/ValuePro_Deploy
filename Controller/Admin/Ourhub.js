const OurhubModel = require("../../Modal/Admin/Ourhub");

class Ourhub {
  async addOurhub(req, res) {
    try {
      let { name, pincodeid, pincode } = req.body;

      if (!(name && pincodeid && pincode)) {
        return res.status(400).json({ msg: "All fields are neccessary!" });
      }

      let NewOurhub = new OurhubModel({
        name,
        pincodeid,
        pincode,
      });
      NewOurhub.save().then(() => {
        return res.status(200).json({ success: "Hub added successfully" });
      });
      console.log("NewOurhub", NewOurhub);
    } catch (error) {
      console.log(error);
    }
  }
  async getOurhub(req, res) {
    try {
      let Ourhub = await OurhubModel.find({})?.populate("pincodeid");
      if (Ourhub?.length) {
        return res.status(200).json({ Ourhub: Ourhub });
      } else {
        return res.status(403).json({ error: "No hub exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOurhub(req, res) {
    try {
      let remove = req.params.id;

      await OurhubModel.findOneAndDelete({ _id: remove })
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

  async editOurhub(req, res) {
    try {
      let { id, name, pincode, pincodeid } = req.body;
      let obj = {};

      if (name) {
        obj.name = name;
      }
      if (pincode) {
        if (!pincodeid) {
          return res
            .status(403)
            .json({ msg: "Cannot update details!!! Please try again!" });
        } else {
          obj.pincode = pincode;
          obj.pincodeid = pincodeid;
        }
      }
      console.log(obj, 32323);

      let updateourhub = await OurhubModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateourhub) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Ourhub: updateourhub,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Ourhubcontroller = new Ourhub();
module.exports = Ourhubcontroller;
