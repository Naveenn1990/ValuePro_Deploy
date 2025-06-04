const OffersModel = require("../../Modal/Admin/Offers1");
const mongoose = require("mongoose");

class Offers {
  async addOffers(req, res) {
    let { Msg, Discription, amount, type } = req.body;
    try {
      let NewOffers = new OffersModel({
        Msg,
        Discription,
        amount,
        type,
      });
      NewOffers.save().then((data) => {
        return res.status(200).json({ success: "Offer added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getOffers(req, res) {
    let Offers = await OffersModel.find({});
    if (Offers) {
      return res.status(200).json({ Offers: Offers });
    } else {
      return res.status(403).json({ error: "No Offers exist" });
    }
  }

  async deleteOffers(req, res) {
    let remove = req.params.id;
    console.log("remove", remove);
    try {
      await OffersModel.findOneAndDelete({ _id: remove })
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

  async editOffers(req, res) {
    let { id, Msg, Discription, type, amount } = req.body;
    try {
      let updateOffers = await OffersModel.findOneAndUpdate(
        { _id: id },
        { Msg: Msg, Discription: Discription, type: type, amount: amount }
      );

      if (updateOffers) {
        return res.status(200).json({
          success: "Details added successfully",
          Offers: updateOffers,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Offerscontroller = new Offers();
module.exports = Offerscontroller;
