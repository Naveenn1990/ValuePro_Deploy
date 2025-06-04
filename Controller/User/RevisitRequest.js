const RevisitModel = require("../../Modal/User/RevisitRequests");

class Revisit{
    async addRevisit(req,res){
        try {
            let {CustName,CustEmail,CustNumber,CustType,CustDate,CustTime} = req.body;
            let NewRevisit = new RevisitModel({
                CustName,CustEmail,CustNumber,CustType,CustDate,CustTime,
            })
            NewRevisit.save().then((data)=>{
                return res.status(200).json({success:"Request sent Successfully"})
            })
        } catch (error) {
            
        }
    }
   

    async getRevisit(req,res){
        try {
            let data=await RevisitModel.find();
            return res.status(200).send({success:data})
        } catch (error) {
            console.log(error);
        }
      }
    async deleteRevisit(req,res){
        try {
            let id = req.params.id;
            let data = await RevisitModel.deleteOne({_id:id});
            return res.status(200).json({success:"Deleted Successfully"})
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Revisit();