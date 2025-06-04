const { uploadFile2 } = require("../../Config/AWS");
const BannerModel = require("../../Modal/Admin/Banner1");

class Banner {
  async addBanner(req, res) {
     try {
    let { name,tagline,url } = req.body;
       let file =await uploadFile2(req.files[0],"banner");
      let NewBanner = new BannerModel({
        name,  
        img: file,
        tagline,url
      });
      NewBanner.save().then((data) => {
        return res.status(200).json({ success: "Banner added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getBanner(req, res) {
    try {
      let Banner = await BannerModel.find({});
      if (Banner) {
        return res.status(200).json({ Banner: Banner });
      } else {
        return res.status(403).json({ error: "No Banner exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteBanner(req, res) {
   try { 
    let remove = req.params.id;

      await BannerModel.findOneAndDelete({ _id: remove })
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

  async editBanner(req, res) {
      try {
    let { id, name ,tagline} = req.body;
    let obj = { name ,tagline};
    if (req?.files?.length != 0) {
      let arr = req.files;
      let i;
      for (i = 0; i < arr?.length; i++) {
        if (arr[i].fieldname == "img") {
          obj["img"] = await uploadFile2(arr[i],"banner");;
        }
      }
    }
  
      let updatebanner = await BannerModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updatebanner) {
        return res.status(200).json({
          success: "Details Updated successfully",
          banner: updatebanner,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const Bannercontroller = new Banner();
module.exports = Bannercontroller;
