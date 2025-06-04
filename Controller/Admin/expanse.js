const expenseModel=require("../../Modal/Admin/expense");

class Expense{
    async AddExpense(req,res){
        try {
            let {expanse,remarks,amount,expanDate}=req.body;
            let data=await expenseModel.create({expanse,remarks,amount,expanDate});
            if(!data) return res.status(400).json({error:"Something went wrong"});
            return res.status(200).json({success:"Successfully added"});
        } catch (error) {
            console.log(error);
        }
    }
    async getExpense(req,res){
        try {
            let data=await expenseModel.find().sort({_id:-1});
            return res.status(200).json({success:data});

        } catch (error) {
            console.log(error);
        }
    }

    async deleteExpense(req,res){
        try {
            let id=req.params.id;
            let data=await expenseModel.deleteOne({_id:id})
            if(data.deletedCount==0) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:"Successfully deleted"});
        } catch (error) {
            console.log(error);
        }
    }
    async updateExpense(req,res){
        try {
            let {id,expanse,remarks,amount,expanDate}=req.body;
            let obj={}
            if(expanse){
                obj["expanse"]=expanse;
            }
             if(remarks){
                obj["remarks"]=remarks;
            }
            if(expanDate){
                obj["expanDate"]=expanDate;
            }
             if(amount){
                obj["amount"]=amount;
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