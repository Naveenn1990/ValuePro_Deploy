const EnquiryModel = require("../../Modal/User/Enquiry");

class Enquiry{
    async addEnquiry(req,res){
        try {
            let {EName,Email,Number,Message} = req.body;
            let NewEnquiry = new EnquiryModel({
                EName,
                Email,
                Number,
                Message,
            })
            NewEnquiry.save().then((data)=>{
                return res.statuc(200).json({success:"Added Successfully"})
            })
        } catch (error) {
            
        }
    }

    async getEnquiry(req,res){
        try {
            let id=req.params.id;
            let data=await EnquiryModel.find({_id:id});
            if(data){
                return res.status(200).json({success:data})
            } else{
                return res.status(400).json({error:"Data Cannot be added"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteEnquiry(req,res){
        try {
            let id = req.params.id;
            let data = await EnquiryModel.deleteOne({_id:id});
            return res.status(200).json({success:"Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Enquiry();