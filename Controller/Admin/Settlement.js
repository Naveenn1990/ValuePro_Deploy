const SettlementModel = require("../../Modal/Admin/Settlement");
const jobsModel = require("../../Modal/Admin/job");
const vendorModel = require("../../Modal/venor/vendor");
const walletModel = require("../../Modal/venor/wallet");
const commissionModel = require("../../Modal/Admin/commission");

class Settlement {
  // Get all completed jobs pending settlement
  async getPendingSettlements(req, res) {
    try {
      // Find completed jobs that haven't been settled yet
      const completedJobs = await jobsModel.find({
        status: "Completed",
        vendorId: { $exists: true, $ne: null },
      }).populate("vendorId");

      // Get already settled job IDs
      const settledJobs = await SettlementModel.find({}).distinct("jobId");

      // Filter out already settled jobs
      const pendingJobs = completedJobs.filter(
        (job) => !settledJobs.includes(job._id.toString())
      );

      return res.status(200).json({ success: pendingJobs });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch pending settlements" });
    }
  }

  // Calculate settlement amount
  async calculateSettlement(req, res) {
    try {
      const { jobId } = req.body;

      const job = await jobsModel.findById(jobId).populate("vendorId");
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (!job.vendorId) {
        return res.status(400).json({ error: "No vendor assigned to this job" });
      }

      // Get commission settings
      const commissionSettings = await commissionModel.findOne();
      const commissionPercent = job.vendorId.commision || commissionSettings?.seramt || 10;

      const bookingAmount = job.TotalAmount || 0;
      const adminCommission = (bookingAmount * commissionPercent) / 100;
      const settlementAmount = bookingAmount - adminCommission;

      return res.status(200).json({
        success: {
          bookingAmount,
          commissionPercent,
          adminCommission,
          settlementAmount,
          vendorDetails: {
            name: job.vendorName,
            mobile: job.vendorMobile,
            bankName: job.vendorId.BankName,
            accountNumber: job.vendorId.AcNo,
            ifscCode: job.vendorId.ifceCode,
            accountHolderName: job.vendorId.ACHoldName,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to calculate settlement" });
    }
  }

  // Create settlement
  async createSettlement(req, res) {
    try {
      const {
        jobId,
        vendorId,
        bookingAmount,
        adminCommission,
        adminCommissionPercent,
        additionalCharges,
        chargesDescription,
        settlementAmount,
        paymentMethod,
        transactionId,
        remarks,
      } = req.body;

      // Validate required fields
      if (!jobId || !vendorId || !bookingAmount || settlementAmount === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if settlement already exists
      const existingSettlement = await SettlementModel.findOne({ jobId });
      if (existingSettlement) {
        return res.status(400).json({ error: "Settlement already exists for this job" });
      }

      // Get vendor details
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      // Create settlement record
      const settlement = new SettlementModel({
        vendorId,
        vendorName: vendor.name,
        jobId,
        bookingAmount,
        adminCommission: adminCommission || 0,
        adminCommissionPercent: adminCommissionPercent || 0,
        additionalCharges: additionalCharges || 0,
        chargesDescription,
        settlementAmount,
        settlementStatus: "Pending",
        paymentMethod: paymentMethod || "Bank Transfer",
        transactionId,
        bankDetails: {
          bankName: vendor.BankName,
          accountNumber: vendor.AcNo,
          ifscCode: vendor.ifceCode,
          accountHolderName: vendor.ACHoldName,
        },
        remarks,
      });

      await settlement.save();

      return res.status(200).json({
        success: "Settlement created successfully",
        settlement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to create settlement" });
    }
  }

  // Process settlement (mark as completed and update wallet)
  async processSettlement(req, res) {
    try {
      const { settlementId, transactionId, settledBy } = req.body;

      const settlement = await SettlementModel.findById(settlementId);
      if (!settlement) {
        return res.status(404).json({ error: "Settlement not found" });
      }

      if (settlement.settlementStatus === "Completed") {
        return res.status(400).json({ error: "Settlement already completed" });
      }

      // Update settlement status
      settlement.settlementStatus = "Completed";
      settlement.settledDate = new Date();
      settlement.settledBy = settledBy;
      if (transactionId) settlement.transactionId = transactionId;

      await settlement.save();

      // Update vendor wallet
      const wallet = await walletModel.findOne({ vendorId: settlement.vendorId });
      if (wallet) {
        wallet.totalAmount += settlement.settlementAmount;
        wallet.transaction.push({
          title: `Settlement for Job #${settlement.jobId}`,
          amount: settlement.settlementAmount,
          status: "CR",
          payId: transactionId || settlement._id,
          date: new Date(),
        });
        await wallet.save();
      }

      return res.status(200).json({
        success: "Settlement processed successfully",
        settlement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to process settlement" });
    }
  }

  // Get all settlements
  async getAllSettlements(req, res) {
    try {
      const settlements = await SettlementModel.find({})
        .populate("vendorId")
        .populate("jobId")
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: settlements });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch settlements" });
    }
  }

  // Get settlements by vendor
  async getSettlementsByVendor(req, res) {
    try {
      const { vendorId } = req.params;

      const settlements = await SettlementModel.find({ vendorId })
        .populate("jobId")
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: settlements });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch vendor settlements" });
    }
  }

  // Update settlement
  async updateSettlement(req, res) {
    try {
      const { settlementId, ...updateData } = req.body;

      const settlement = await SettlementModel.findByIdAndUpdate(
        settlementId,
        { $set: updateData },
        { new: true }
      );

      if (!settlement) {
        return res.status(404).json({ error: "Settlement not found" });
      }

      return res.status(200).json({
        success: "Settlement updated successfully",
        settlement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to update settlement" });
    }
  }

  // Delete settlement
  async deleteSettlement(req, res) {
    try {
      const { id } = req.params;

      const settlement = await SettlementModel.findById(id);
      if (!settlement) {
        return res.status(404).json({ error: "Settlement not found" });
      }

      if (settlement.settlementStatus === "Completed") {
        return res.status(400).json({
          error: "Cannot delete completed settlement",
        });
      }

      await SettlementModel.findByIdAndDelete(id);

      return res.status(200).json({ success: "Settlement deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete settlement" });
    }
  }

  // Get settlement statistics
  async getSettlementStats(req, res) {
    try {
      const totalSettlements = await SettlementModel.countDocuments();
      const pendingSettlements = await SettlementModel.countDocuments({
        settlementStatus: "Pending",
      });
      const completedSettlements = await SettlementModel.countDocuments({
        settlementStatus: "Completed",
      });

      const totalSettlementAmount = await SettlementModel.aggregate([
        { $match: { settlementStatus: "Completed" } },
        { $group: { _id: null, total: { $sum: "$settlementAmount" } } },
      ]);

      const totalCommission = await SettlementModel.aggregate([
        { $match: { settlementStatus: "Completed" } },
        { $group: { _id: null, total: { $sum: "$adminCommission" } } },
      ]);

      return res.status(200).json({
        success: {
          totalSettlements,
          pendingSettlements,
          completedSettlements,
          totalSettlementAmount: totalSettlementAmount[0]?.total || 0,
          totalCommission: totalCommission[0]?.total || 0,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch statistics" });
    }
  }
}

const SettlementController = new Settlement();
module.exports = SettlementController;
