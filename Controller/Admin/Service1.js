const { uploadFile2 } = require("../../Config/AWS");
const ServiceModel = require("../../Modal/Admin/Service1");

class Service {
  async addService(req, res) {
    try {
      let {
        ProductName,
        name,
        description,
        price,
        tax,
        category,
        warrantyperiod,
        warrentyTillDate,
        commission
      } = req.body;
      let file =  await uploadFile2(req.files[0],"service");

      let NewService = new ServiceModel({
        ProductName,
        name,
        description,
        price,
        tax,
        img: file,
        category,
        warrantyperiod,
        warrentyTillDate,
        commission
      });
      NewService.save().then((data) => {
        return res.status(200).json({ success: "Service added successfully" });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: "Service not added, something went wrong!!!" });
    }
  }

  async getService(req, res) {
    try {
      const isPaginationRequested = req.query.page || req.query.limit;
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip  = (page - 1) * limit;

      const filter = {};

      // Category: match with trim on both sides to handle trailing spaces in DB
      if (req.query.category && req.query.category.trim()) {
        const cat = req.query.category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.category = { $regex: `^\\s*${cat}\\s*$`, $options: 'i' };
      }

      // Search by name
      if (req.query.search && req.query.search.trim()) {
        filter.name = { $regex: req.query.search.trim(), $options: 'i' };
      }

      let query = ServiceModel.find(filter);
      if (isPaginationRequested) {
        query = query.skip(skip).limit(limit);
      }

      const [Service, total] = await Promise.all([
        query,
        ServiceModel.countDocuments(filter),
      ]);

      return res.status(200).json({
        Service: Service || [],
        total,
        page: isPaginationRequested ? page : 1,
        limit: isPaginationRequested ? limit : total,
        totalPages: isPaginationRequested ? Math.ceil(total / limit) : 1,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async deleteService(req, res) {
    try {
      let remove = req.params.id;
      const deleteService = await ServiceModel.deleteOne({ _id: remove });
      if (deleteService) {
        return res
          .status(200)
          .json({ success: "service deleted, successfully..." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async editService(req, res) {
    try {
      let serviceid = req.params.id;
      let {
        name,
        description,
        price,
        tax,
        category,
        warrantyperiod,
        warrentyTillDate,
        commission
      } = req.body;
      const obj = {};
      if (req?.files?.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "img") {
            obj["img"] =await uploadFile2(arr[i],"service");
          }
        }
      }
      if (name) {
        obj.name = name;
      }
      if(commission==0||commission){
          obj.commission=commission;
      }
      if (category) {
        obj.category = category;
      }
      if (description) {
        obj.description = description;
      }
      if (price) {
        obj.price = price;
      }
      if (tax) {
        obj.tax = tax;
      }
      if (warrantyperiod) {
        obj.warrantyperiod = warrantyperiod;
      }
      if (warrentyTillDate) {
        obj.warrentyTillDate = warrentyTillDate;
      }
      let updateService = await ServiceModel.findOneAndUpdate(
        { _id: serviceid },
        { $set: obj },
        { new: true }
      );

      if (updateService) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Service: updateService,
        });
      }
      return res.status(500).json({ error: "cannot able to do" });
    } catch (error) {
      console.log(error);
    }
  }
  async mackActiveAndDeactive(req, res) {
    try {
      let { id, isActive } = req.body;
      let data = await ServiceModel.findOneAndUpdate(
        { _id: id },
        { $set: { isActive: isActive } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      if (data.isActive == true)
        return res.status(200).json({ success: "Successfully activated" });
      return res
        .status(200)
        .json(200)
        .json({ success: "Successfully deactivated" });
    } catch (error) {
      console.log(error);
    }
  }
}

const Servicecontroller = new Service();
module.exports = Servicecontroller;
