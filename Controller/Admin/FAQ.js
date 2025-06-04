const FAQModel = require("../../Modal/Admin/FAQ");

class Faq{
    async addFAQ(req, res) {
        try {
          let {
            question,
            answer,
          } = req.body;
          let NewFAQ = new FAQModel({
            question,
            answer,
          });
          // console.log("NewAddress", NewAddress);
          NewFAQ.save().then((data) => {
            return res.status(200).json({ success: "Added Successfully" });
          });
        } catch (error) {
          console.log(error);
        }
      }

    async getAllFaq(req,res){
        try {
            let data=await FAQModel.find();
            return res.status(200).send({success:data})
        } catch (error) {
           console.log(error); 
        }
    }

    async deleteFAQ(req, res) {
      try { 
       let remove = req.params.id;
    
         await FAQModel.findOneAndDelete({ _id: remove })
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

    async editFAQ(req, res) {
        let { id, question,answer } = req.body;
        let obj = {};
        if (req?.files?.length != 0) {
          let arr = req.files;
          let i;
          // for (i = 0; i < arr?.length; i++) {
            // if (arr[i].fieldname == "img") {
            //   obj["img"] = arr[i].filename;
            // }
          // }
            if(question){
              obj["question"] = question;
            }
            if(answer){
              obj["answer"] = answer;
            }
          
        }
        try {
          let updateFaq = await FAQModel.findOneAndUpdate(
            { _id: id },
            { $set: obj },
            { new: true }
          );
    
          if (updateFaq) {
            return res.status(200).json({
              success: "Details updated successfully",
              Faq: updateFaq,
            });
          } else {
            return res.status(500).json({ error: "Something went wrong" });
          }
        } catch (error) {
          console.log(error);
        }
      }
}

module.exports = new Faq();