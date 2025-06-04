const SubCategoryModel = require("../../Modal/Admin/SubCategory");

class SubCat {
  async addSubCategory(req, res) {
    let { categoryid, name } = req.body;
    try {
      let NewSubcategory = new SubCategoryModel({
        categoryid,
        name,
      });
      NewSubcategory.save().then((data) => {
        return res.status(200).json({
          success: "subcategory added ",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getSubCategory(req, res) {
    let SubCategory = await SubCategoryModel.find({}).populate("categoryid");
    if (SubCategory?.length > 0) {
      return res.status(200).json({ SubCategory: SubCategory });
    } else {
      return res.status(403).json({ error: "No SubCategory exist" });
    }
  }
  async deleteSubCategory(req, res) {
    let remove = req.params.id;
    console.log("remove", remove);
    try {
      await SubCategoryModel.findOneAndDelete({ _id: remove })
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
}

const SubCategorycontroller = new SubCat();
module.exports = SubCategorycontroller;
