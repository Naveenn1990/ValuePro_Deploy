const ProtimingModel = require("../../Modal/Admin/Protiming");

class Protiming {
  async addProtiming(req, res) {
     try {
    let { name, name1} = req.body;
   
      let NewProtiming = new ProtimingModel({
        name,
        name1,
      });
      NewProtiming.save().then((data) => {
        return res.status(200).json({ success: "Hub added successfully" });
      });
      console.log("NewProtiming",NewProtiming)
    } catch (error) {
      console.log(error);
    }
  }
  async getProtiming(req, res) {
    try {
      let Protiming = await ProtimingModel.find({});
      if (Protiming) {
        return res.status(200).json({ Protiming: Protiming });
      } else {
        return res.status(403).json({ error: "No hub exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProtiming(req, res) {
   try { 
    let remove = req.params.id;

      await ProtimingModel.findOneAndDelete({ _id: remove })
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

  async editProtiming(req, res) {
      try {
    let { id, name, name1 } = req.body;
    console.log("id",id)
    let obj = { name , name1,};

      let updateprotiming = await ProtimingModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateprotiming) {
        return res.status(200).json({
          success: "Details Updated successfully",
          protiming: updateprotiming,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Protimingcontroller = new Protiming();
module.exports = Protimingcontroller;
