const AddressModel = require("../../Modal/Admin/Address");

class Address {
  async addAddress(req, res) {
    try {
      let {
        userId,
        name,
        email,
        phone,
        state,
        city,
        village,
        houseno,
        pincode,
        AddressType,
        lat,
        lang,
      } = req.body;
      let NewAddress = new AddressModel({
        userId,
        name,
        email,
        phone,
        state,
        city,
        village,
        houseno,
        pincode,
        AddressType,
        lat,
        lang,
      });
      console.log("NewAddress", NewAddress);
      NewAddress.save().then((data) => {
        return res.status(200).json({ success: "Address Successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAddress(req, res) {
    try {
      let addressid = req.params.id;
      let Address = await AddressModel.find({ userId: addressid }).populate(
        "userId"
      );

      return res.status(200).json({ Address: Address });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteaddress(req, res) {
    try {
      let id = req.params.id;
      let data = await AddressModel.deleteOne({ _id: id });
      return res.status(200).json({ success: "Successfully delete" });
    } catch (error) {
      console.log(error);
    }
  }
}

const Addresscontroller = new Address();
module.exports = Addresscontroller;
