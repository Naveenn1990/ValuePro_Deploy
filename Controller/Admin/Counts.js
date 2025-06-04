const CountsModel = require("../../Modal/Admin/Counts");

class Counts {
  // post method
  async Counts(req, res) {
    try {
      let { Counts, Text } =
        req.body;

      const newCounts = new CountsModel({
        Counts,
        Text,
      });
      newCounts.save().then((data) => {
        return res.status(200).json({ success: "Data Added Successfully" });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Data Can't be added" });
    }
  }
  // get method
  async getCounts(req, res) {
    try {
      const getCounts = await CountsModel.find({});
      if (getCounts) {
        return res.status(200).json({ getCounts: getCounts });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //delete method
  async deleteCounts(req, res) {
    try {
      const deleteCounts = req.params.Id;
      await CountsModel.deleteOne({ _id: deleteCounts });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot be Deleted" });
    }
  }
  //update method
  async editCounts(req, res) {
    let { id, Counts, Text} =
      req.body;

    let obj = {};
    if (Counts) {
      obj["Counts"] = Counts;
    }
    if (Text) {
      obj["Text"] = Text;
    }
    try {
      let data = await CountsModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "successfully Updated" });
    } catch (error) {
      console.log(error);
    }
  }
}

const CountsController = new Counts();
module.exports = CountsController;
