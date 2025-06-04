const expenseModel=require("../../Modal/Admin/expenseType");

class Expense{
    async AddExpenseType(req,res){
        try {
            let {expanseT,}=req.body;
         
         
            let check =await expenseModel.findOne({expanseT:expanseT});
            if(check) return res.status(400).json({error:"Expanse already exits"})
            let data=await expenseModel.create({expanseT});
            if(!data) return res.status(400).json({error:"Something went wrong"});
            return res.status(200).json({success:"Successfully added"});
        } catch (error) {
            console.log(error);
        }
    }
    async getExpenseType(req,res){
        try {
            let data=await expenseModel.find().sort({_id:-1});
            return res.status(200).json({success:data});

        } catch (error) {
            console.log(error);
        }
    }

    async deleteExpenseType(req,res){
        try {
            let id=req.params.id;
            let data=await expenseModel.deleteOne({_id:id})
            if(data.deletedCount==0) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:"Successfully deleted"});
        } catch (error) {
            console.log(error);
        }
    }
    async updateExpenseType(req,res){
        try {
            let {id,expanseT}=req.body;
            let obj={}
            if(expanseT){
                obj["expanseT"]=expanseT;
            }
         
            let data=await expenseModel.findOneAndUpdate({_id:id},{$set:obj},{new:true});
            if(!data) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:"Successfully updated"});
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new Expense();