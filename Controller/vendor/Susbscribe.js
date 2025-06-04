const subscribeModel = require("../../Modal/venor/Susbcribe");

class SubcribePackage {
  async AddSubCribe(req, res) {
    try {
      let {
        vendorId,
        PaymentId,
        SubscriptionId,
        totalJob,
        packageMinKm,
        packageMaxKm,
        packageDays,
        packageMinHr,
        price,
        startDate,
        endDate,
        commission
      } = req.body;
      let check = await subscribeModel.findOne({
        vendorId: vendorId,
        isActive: true,
      });
      if (check) return res.status(400).json({ error: "Already Subscribed!" });
      let data = await subscribeModel.create({
        vendorId,
        PaymentId,
        SubscriptionId,
        totalJob,
        packageMinKm,
        packageMaxKm,
        packageDays,
        packageMinHr,
        price,
        startDate,
        endDate,
        commission
      });
      if (!data) return res.status(400).json({ error: "Something went wrong" });
      return res.status(200).json({ success: "Successfully subscribe" });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllSubscribe(req, res) {
    try {
      let data = await subscribeModel.find().sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllSubscribeByVendorId(req, res) {
    try {
      let id = req.params.id;
      let data = await subscribeModel.find({ vendorId: id }).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async getActiveSubscribeByVendorId(req, res) {
    try {
      let id = req.params.id;
      let data = await subscribeModel.findOne({ vendorId: id,isActive:true }).sort({ _id: -1 }).populate("SubscriptionId");
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async makeActiveAndDeactive(req, res){
    try {
      let { isActive, id } = req.body;
      let data = await subscribeModel.findOneAndUpdate(
        { _id: id },
        { $set: { isActive: isActive } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      if (data.isActive == true)
        return res.status(200).json({ success: "Successfully Activated" });
      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new SubcribePackage();
