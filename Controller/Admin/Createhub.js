const CreatehubModel = require("../../Modal/Admin/Createhub");

class Createhub {
  async addCreatehub(req, res) {
     try {
    let { name} = req.body;
   
      let NewCreatehub = new CreatehubModel({
        name,
      });
      NewCreatehub.save().then((data) => {
        return res.status(200).json({ success: "Hub added successfully" });
      });
      console.log("NewCreatehub",NewCreatehub)
    } catch (error) {
      console.log(error);
    }
  }
  async getCreatehub(req, res) {
    try {
      let Createhub = await CreatehubModel.find({});
      if (Createhub) {
        return res.status(200).json({ Createhub: Createhub });
      } else {
        return res.status(403).json({ error: "No hub exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCreatehub(req, res) {
   try { 
    let remove = req.params.id;

      await CreatehubModel.findOneAndDelete({ _id: remove })
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

  async editCreatehub(req, res) {
      try {
    let { id, name } = req.body;
    console.log("id",id)
   
      let obj = {};
      if (name) {
        obj["name"] = name;
      }

      let updatecreatehub = await CreatehubModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updatecreatehub) {
        return res.status(200).json({
          success: "Details Updated successfully",
          createhub: updatecreatehub,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Createhubcontroller = new Createhub();
module.exports = Createhubcontroller;
