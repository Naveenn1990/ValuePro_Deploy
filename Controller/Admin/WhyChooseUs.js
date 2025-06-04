const { uploadFile2 } = require("../../Config/AWS");
const WhychooseusModel = require("../../Modal/Admin/WhyChooseUs");

class Whychooseus {
  async addWhychooseus(req, res) {
    try {
      let { Header, title, desc } = req.body;
      let file =  await uploadFile2(req.files[0],"whychoose");

      let NewWhychooseus = new WhychooseusModel({
        Header,
        img: file,
        title,
        desc,
      });
      NewWhychooseus.save().then((data) => {
        return res
          .status(200)
          .json({ success: "Whychooseus added successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getWhychooseus(req, res) {
    try {
      let Whychooseus = await WhychooseusModel.find({});
      if (Whychooseus) {
        return res.status(200).json({ Whychooseus: Whychooseus });
      } else {
        return res.status(403).json({ error: "No Whychooseus exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteWhychooseus(req, res) {
    try {
      let id = req.params.id;

      await WhychooseusModel.findOneAndDelete({ _id: id })
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

  async editWhychooseus(req, res) {
    try {
      let { id, Header, title, desc } = req.body;
      console.log("check data", id, Header, title, desc)
      let obj = {};
      if (req?.files?.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "img") {
            obj["img"] = await uploadFile2(arr[i],"whychoose");
          }
        }
      }
        if (Header) {
          obj["Header"] = Header;
        }
        if (title) {
          obj["title"] = title;
        }
        if (desc) {
          obj["desc"] = desc;
        }
     
     
      let updateWhychooseus = await WhychooseusModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateWhychooseus) {
        return res.status(200).json({
          success: "Details Updated successfully",
          Whychooseus: updateWhychooseus,
        });
      } else {
        return res.status(500).json({ error: "cannot able to do" });
      }
    } catch (error) {
      console.log(error);
      console.log({error:"Internal server error"})
    }
  }
}

const Whychooseuscontroller = new Whychooseus();
module.exports = Whychooseuscontroller;
