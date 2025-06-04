const { uploadFile2 } = require("../../Config/AWS");
const CategoryModel = require("../../Modal/Admin/Category1");
const mongoose = require("mongoose");

class Category {
  async addCategory(req, res) {
    let { name , url} = req.body;
      let file =await uploadFile2(req.files[0],"category");
    try {
      let NewCategory = new CategoryModel({
        name,
        url,
        img: file,
      });
      NewCategory.save().then((data) => {
        return res.status(200).json({ success: "Category added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getCategory(req, res) {
    let Category = await CategoryModel.find({});
    if (Category) {
      return res.status(200).json({ Category: Category });
    } else {
      return res.status(403).json({ error: "No Category exist" });
    }
  }

  async deleteCategory(req, res) {
    let remove = req.params.id;
    console.log("remove", remove);
    try {
      await CategoryModel.findOneAndDelete({ _id: remove })
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

  async editCategory(req, res) {
    let { id, name } = req.body;
    let obj = { name };
    if (req?.files?.length != 0) {
      let arr = req.files;
      let i;
      for (i = 0; i < arr?.length; i++) {
        if (arr[i].fieldname == "img") {
          obj["img"] =await uploadFile2(arr[i],"category");
        }
      }
    }
    try {
      let updateCategory = await CategoryModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateCategory) {
        return res.status(200).json({
          success: "Details added successfully",
          Category: updateCategory,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Categorycontroller = new Category();
module.exports = Categorycontroller;
