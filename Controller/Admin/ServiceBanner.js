const { uploadFile2 } = require("../../Config/AWS");
const ServiceBannerModel = require("../../Modal/Admin/ServiceBanner");

class ServiceBanner {
  async addServiceBanner(req, res) {
    try {
      let { name, tagline, url } = req.body;
      let file = await uploadFile2(req.files[0], "servicebanner");
      let NewServiceBanner = new ServiceBannerModel({
        name,
        img: file,
        tagline,
        url,
      });
      NewServiceBanner.save().then((data) => {
        return res
          .status(200)
          .json({ success: "Service Banner added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getServiceBanner(req, res) {
    try {
      let ServiceBanner = await ServiceBannerModel.find({});
      if (ServiceBanner) {
        return res.status(200).json({ ServiceBanner: ServiceBanner });
      } else {
        return res.status(403).json({ error: "No Service Banner exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteServiceBanner(req, res) {
    try {
      let remove = req.params.id;

      await ServiceBannerModel.findOneAndDelete({ _id: remove })
        .then((data) => {
          return res.json({ Success: "Removed Successfully" });
        })
        .catch((err) => {
          return res.status(500).json({ error: "Something went wrong" });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async editServiceBanner(req, res) {
    try {
      let { id, name, tagline } = req.body;
      let obj = { name, tagline };
      if (req?.files?.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "img") {
            obj["img"] = await uploadFile2(arr[i], "servicebanner");
          }
        }
      }

      let updateBanner = await ServiceBannerModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateBanner) {
        return res.status(200).json({
          success: "Details Updated successfully",
          banner: updateBanner,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const ServiceBannercontroller = new ServiceBanner();
module.exports = ServiceBannercontroller;
