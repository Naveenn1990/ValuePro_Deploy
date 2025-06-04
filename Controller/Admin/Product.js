const { uploadFile2 } = require("../../Config/AWS");
const productModel1 = require("../../Modal/Admin/Product");

class Product {
  async AddProduct(req, res) {
    try {
      let {
        productName,
        category,
        productDiscription,
        subcategory,
        remaingStock,
        totalStock,
        hsnCode,
        addedBy,
        specification,
        howToUse,
        gst,
        price,
        discount,
        productModel,
        brand,
      } = req.body;

      let obj = {
        productName,
        category,
        productDiscription,
        subcategory,
        remaingStock,
        totalStock,
        hsnCode,
        addedBy,
        specification,
        howToUse,
        gst,
        price,
        discount,
        productModel,
        brand,
      };
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "image1") {
            obj["image1"] = await uploadFile2(arr[i],"product");
          }
          if (arr[i].fieldname == "image2") {
            obj["image2"] = await uploadFile2(arr[i],"product");
          }
          if (arr[i].fieldname == "image3") {
            obj["image3"] = await uploadFile2(arr[i],"product");
          }
          if (arr[i].fieldname == "image4") {
            obj["image4"] = await uploadFile2(arr[i],"product");
          }
        }
      }
      console.log("obj", obj);
      let data = await productModel1.create(obj);
      console.log("data", data);
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully added" });
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(req, res) {
    try {
      let {
        id,
        brand,
        productModel,
        productName,
        category,
        productDiscription,
        subcategory,
        remaingStock,
        totalStock,
        hsnCode,
        addedBy,
        vendorId,
        specification,
        howToUse,
        gst,
        price,
        discount,
      } = req.body;
      let obj = {};
      if (productName) {
        obj["productName"] = productName;
      }
      if (brand) {
        obj["brand"] = brand;
      }
      if (productModel) {
        obj["productModel"] = productModel;
      }
      if (category) {
        obj["category"] = category;
      }
      if (productDiscription) {
        obj["productDiscription"] = productDiscription;
      }
      if (subcategory) {
        obj["subcategory"] = subcategory;
      }
      if (remaingStock) {
        obj["remaingStock"] = remaingStock;
      }
      if (totalStock) {
        obj["totalStock"] = totalStock;
      }
      if (hsnCode) {
        obj["hsnCode"] = hsnCode;
      }
      if (addedBy) {
        obj["addedBy"] = addedBy;
      }
      if (vendorId) {
        obj["vendorId"] = vendorId;
      }
      if (gst) {
        obj["gst"] = gst;
      }
      if (price) {
        obj["price"] = price;
      }
      if (discount) {
        obj["discount"] = discount;
      }
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "image1") {
            obj["image1"] = await uploadFile2(arr[i],"product");
          }
          if (arr[i].fieldname == "image2") {
            obj["image2"] = await uploadFile2(arr[i],"product");
          }
          if (arr[i].fieldname == "image3") {
            obj["image3"] = await uploadFile2(arr[i],"product");
          }
          if (arr[i].fieldname == "image4") {
            obj["image4"] = await uploadFile2(arr[i],"product");
          }
        }
      }
      let data = await productModel1.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProduct(req, res) {
    try {
      let data = await productModel1.find().sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(req, res) {
    try {
      let id = req.params.id;
      let data = await productModel1.findById(id);
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct(req, res) {
    try {
      let id = req.params.id;
      let data = await productModel1.deleteOne({ _id: id });
      if (data.deletedCount == 0)
        return res.status(400).json({ error: "Data not found" });

      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProduct(req, res) {
    try {
      let data = await productModel1.find().sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async AddspecificationProduct(req, res) {
    try {
      let { id, point } = req.body;
      let data = await productModel1.findOneAndUpdate(
        { _id: id },
        { $push: { specification: { point: point } } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async RemoveSpecificationProduct(req, res) {
    try {
      let { id, removeId } = req.body;
      let data = await productModel1.findOneAndUpdate(
        { _id: id },
        { $pull: { specification: { _id: removeId } } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async AddHowToUseProduct(req, res) {
    try {
      let { id, point1 } = req.body;
      let data = await productModel1.findOneAndUpdate(
        { _id: id },
        { $push: { howToUse: { point1: point1 } } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async RemoveHowToUseProduct(req, res) {
    try {
      let { id, removeId } = req.body;
      let data = await productModel1.findOneAndUpdate(
        { _id: id },
        { $pull: { howToUse: { _id: removeId } } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async Productstatus(req, res) {
    try {
      let { id, status } = req.body;
      console.log("ckeckStatus", id, status )
      let data = await productModel1.findOneAndUpdate(
        { _id: id },
        { $set: { status: status} },
        { new: true }
      );

      if (!data) return res.status(400).json({ error: "Data not found" });
      if (data.status =="Inactive"){
            return res.status(200).json({ success: "Successfully Inactive", data:data });
      }else{
            return res.status(200).json({ success: "Successfully Active", data:data });
      
      }
      
    
    } catch (error) {
       return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  


 
}
module.exports = new Product();
