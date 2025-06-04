const PincodeModel = require("../../Modal/Admin/Pincode");

class Pincode {
  async addPincode(req, res) {
    try {
      let { state, city, area, pincode } = req.body;

      let NewPincode = new PincodeModel({
        state,
        city,
        area,
        pincode,
      });
      NewPincode.save().then((data) => {
        return res.status(200).json({ success: "Pincode added successfully" });
      });
      console.log("NewPincode", NewPincode);
    } catch (error) {
      console.log(error);
    }
  }
  async getPincode(req, res) {
    try {
      let Pincode = await PincodeModel.find({});
      if (Pincode) {
        return res.status(200).json({ Pincode: Pincode });
      } else {
        return res.status(403).json({ error: "No pincode exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deletePincode(req, res) {
    try {
      let remove = req.params.id;

      await PincodeModel.findOneAndDelete({ _id: remove })
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

  async editPincode(req, res) {
    try {
      let { id, name, state, city, area, pincode } = req.body;
      let obj = {};
      if (name) {
        obj.name = name;
      }
      if (state) {
        obj.state = state;
      }
      if (city) {
        obj.city = city;
      }
      if (area) {
        obj.area = area;
      }
      if (pincode) {
        obj.pincode = pincode;
      }

      let updatepincode = await PincodeModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updatepincode) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Pincode: updatepincode,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Pincodecontroller = new Pincode();
module.exports = Pincodecontroller;
