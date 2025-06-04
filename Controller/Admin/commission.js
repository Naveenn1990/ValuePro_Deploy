const commissionModel=require("../../Modal/Admin/commission");

class Commission{
async addCommission(req,res){
    try {
        let{seramt,productpr}=req.body;
        let data=await commissionModel.create({productpr,seramt});
        return res.status(200).json({success:"Successfully added",data})
    } catch (error) {
        console.log(error);
    }
}

async getCommission(req,res){
    try {
        let data=await commissionModel.find();
        return res.status(200).json({success:data})
    } catch (error) {
        console.log(error);
    }
}
async updateCommission(req, res) {
    try {
        const { id } = req.params; // Get the commission ID from URL parameters
        const { seramt, productpr } = req.body; // Destructure new values from request body

        // Find the commission entry by ID and update it
         let obj = {};
 
         if (seramt) {
        obj.seramt = seramt;
      }
         if (productpr) {
        obj.productpr = productpr;
      }
        const updatedData = await commissionModel.findByIdAndUpdate(
            id, 
             { $set: obj },
             { new: true } // Return the updated document
        );

        // If the commission doesn't exist
        if (!updatedData) {
            return res.status(404).json({ error: "Commission not found" });
        }

        // Return success with updated data
        return res.status(200).json({ success: "Commission successfully updated", data: updatedData });
    } catch (error) {
        // Log the error and return a response
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

}
module.exports=new Commission();