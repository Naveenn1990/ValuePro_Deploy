const LeaveModel = require("../../Modal/Admin/Leave");
const NotificationsModel = require("../../Modal/Admin/Notifications");
const moment = require("moment")
class Leave {
  async addvendorleave(req, res) {
    try {
      let { userId, VendorName, days, Fromdate, Todate, Reason } = req.body;
      if (!VendorName)
        return res.status(400).json({ error: "Please enter Name!" });
      if (!days) return res.status(400).json({ error: "Please enter days!" });
      if (Fromdate) {
      }
      if (!Todate)
        return res.status(400).json({ error: "Please enter your End Date" });

      if (!Reason)
        return res.status(400).json({ error: "Please enter your comments" });
      let data = await LeaveModel.create({
        userId,
        VendorName,
        days,
        Fromdate,
        Todate,
        Reason,
      });
      if (!data) return res.status(400).json({ error: "Something went wrong" });
      await NotificationsModel.create({
        title: "Apply Leave",
        userid: userId,
        comment: ` Confirm ${data?.VendorName} Fromdate  ${moment(data?.Fromdate).format('YYYY-MM-DD')} Todate ${moment(data?.Todate).format('YYYY-MM-DD')} days(${data?.days}) and Reason ${data?.Reason}`,
      });

      return res
        .status(200)
        .json({ success: "Team will be give response as soon as, thank you" });
    } catch (error) {
      console.log(error);
    }
  }

  async getvendorleave(req, res) {
    try {
      let data = await LeaveModel.find().sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  
  async getvendorleavewithId(req, res) {
  const id = req.params.id;
  console.log(id,"iddddddddddd")
  try {
    const data = await LeaveModel.find({ userId: id });
    console.log(data,"dddddddddata")
    if (!data) {
      return res.status(400).json({ success: false, message: "Leave not found" });
    }
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

  
  async makeChangevendorLeave(req, res) {
    try {
      let { id, status } = req.body;
      let data = await LeaveModel.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: `Successfully updated` });
    } catch (error) {
      console.log(error);
    }
  }
  async deletevendorLeave(req, res) {
    try {
      let id = req.params.id;
      let data = await LeaveModel.deleteOne({ _id: id });
      if (data.deletedCount == 0)
        return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }
  async makeApproveleave(req, res) {
    try {
      let { id, status } = req.body;
      let data = await LeaveModel.findOneAndUpdate(
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
  
  async makeadmireason(req,res){
      try{
          let{id,adminreason}=req.body
          console.log(id,adminreason,"dvvvvvvvvvvvvv")
          let data = await LeaveModel.findOneAndUpdate(
        { _id: id },
        { $set: { adminreason: adminreason } },
        { new: true }
      );
          return res.status(200).json({success:"Successfully updated"});
      }
      catch(error){
           console.log(error)
           return res.status(500).json({error:"Internal server error"});
      }
  }
    
}

module.exports = new Leave();
