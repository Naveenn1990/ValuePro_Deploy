const express = require("express");
const router = express.Router();
const SubCategorycontroller = require("../../Controller/Admin/SubCategory");

router.post("/addsubcategory", SubCategorycontroller.addSubCategory);
router.get("/getsubcategory", SubCategorycontroller.getSubCategory);
router.delete(
  "/removesubcategory/:id",
  SubCategorycontroller.deleteSubCategory
);

module.exports = router;
