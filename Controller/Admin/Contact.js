const contactPageModel = require("../../Modal/Admin/Contact");

class Contact {
  // async addAndUpdateContactPage(req, res) {
  //   try {
  //     let { Adress, email, mobile } = req.body;
  //     let data = await contactPageModel.findOne();
  //     if (!data) {
  //       await contactPageModel.create({Adress, email, mobile });
  //       return res.status(200).send({success:"Successfully added"});
  //     }else{
  //       data.Adress=Adress;
  //       data.email=email;
  //       data.mobile=mobile;
  //       data.save();
  //       return res.status(200).send({success:"Successfully updated"});
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async addContactPage(req, res) {
    try {
      let {
        Adress,
        email,
        mobile,
      } = req.body;
      let NewContact = new contactPageModel({
        Adress,
        email,
        mobile,
      });
      // console.log("NewAddress", NewAddress);
      NewContact.save().then((data) => {
        return res.status(200).json({ success: "Address Successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllContactPage(req,res){
    try {
        let data=await contactPageModel.find();
        return res.status(200).send({success:data})
    } catch (error) {
        console.log(error);
    }
  }


// async deleteContactPage(req, res) {
//     try { 
//      let remove = req.params.id;
 
//        await BannerModel.findOneAndDelete({ _id: remove })
//          .then((data) => {
//            return res.json({ Success: "Removed Successfully" });
//          })
//          .catch((err) => {
//            return res.status({ error: "Something went wrong" });
//          });
//      } catch (error) {
//        console.log(error);
//      }
//    }

async deleteContactPage(req, res) {
  try { 
   let remove = req.params.id;

     await contactPageModel.findOneAndDelete({ _id: remove })
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

   async editContact(req, res) {
    let { id, Adress,email,mobile } = req.body;
    let obj = {};
    if (req?.files?.length != 0) {
      let arr = req.files;
      let i;
      // for (i = 0; i < arr?.length; i++) {
        // if (arr[i].fieldname == "img") {
        //   obj["img"] = arr[i].filename;
        // }
      // }
        if(Adress){
          obj["Adress"] = Adress;
        }
        if(email){
          obj["email"] = email;
        }
        if(mobile){
          obj["mobile"] = mobile;
        }
      
    }
    try {
      let updateContact = await contactPageModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateContact) {
        return res.status(200).json({
          success: "Details updated successfully",
          Contact: updateContact,
        });
      } else {
        return res.status(500).json({ error: "Something went wrong" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new Contact();
