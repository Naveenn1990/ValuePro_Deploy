const SlotbookingModel = require("../../Modal/Admin/Slotbooking1");

class Slotbooking1 {
  async addSlotbooking(req, res) {
     try {
    let { name, name1} = req.body;
   
      let NewSlotbooking = new SlotbookingModel({
        name,
        name1,
      });
      NewSlotbooking.save().then((data) => {
        return res.status(200).json({ success: "Slot added successfully" });
      });
      console.log("NewSlotbooking",NewSlotbooking)
    } catch (error) {
      console.log(error);
    }
  }
  async getSlotbooking(req, res) {
    try {
      let Slotbooking = await SlotbookingModel.find({});
      if (Slotbooking) {
        return res.status(200).json({ Slotbooking: Slotbooking });
      } else {
        return res.status(403).json({ error: "No hub exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSlotbooking(req, res) {
   try { 
    let remove = req.params.id;

      await SlotbookingModel.findOneAndDelete({ _id: remove })
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

  async editSlotbooking(req, res) {
      try {
    let { id, name, name1 } = req.body;
    console.log("id",id)
    let obj = { name , name1,};

      let updateSlotbooking = await SlotbookingModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateSlotbooking) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Slotbooking: updateSlotbooking,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Slotbookingcontroller = new Slotbooking1();
module.exports = Slotbookingcontroller;
