const SocialMediasModel = require("../../Modal/Admin/SocialMedias");

class SocialMedias{
    async addSocialMedias(req, res) {
        try {
          let {
            MediaName,
            MediaURL,
          } = req.body;
          let NewSocial = new SocialMediasModel({
            MediaName,
            MediaURL,
          });
          // console.log("NewAddress", NewAddress);
          NewSocial.save().then((data) => {
            return res.status(200).json({ success: "Added Successfully" });
          });
        } catch (error) {
          console.log(error);
        }
      }

    async getAllMedias(req,res){
        try {
            let data = await SocialMediasModel.find();
            return res.status(200).send({success:data});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteSocialMedia(req, res) {
      try { 
       let remove = req.params.id;
    
         await SocialMediasModel.findOneAndDelete({ _id: remove })
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


    async editSocialMedias(req, res) {
        let { id, MediaName,MediaURL } = req.body;
        let obj = { MediaName,MediaURL };
        if (req?.files?.length != 0) {
          let arr = req.files;
          let i;
          // for (i = 0; i < arr?.length; i++) {
            // if (arr[i].fieldname == "img") {
            //   obj["img"] = arr[i].filename;
            // }
          // }
            if(MediaName){
              obj["MediaName"] = MediaName;
            }
            if(MediaURL){
              obj["MediaURL"] = MediaURL;
            }
          
        }
        try {
          let updateSocial = await SocialMediasModel.findOneAndUpdate(
            { _id: id },
            { $set: obj },
            { new: true }
          );
    
          if (updateSocial) {
            return res.status(200).json({
              success: "Details updated successfully",
              Social: updateSocial,
            });
          } else {
            return res.status(500).json({ error: "Something went wrong" });
          }
        } catch (error) {
          console.log(error);
        }
      }
}

module.exports = new SocialMedias();