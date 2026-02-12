const OurhubModel = require("../../Modal/Admin/Ourhub");

class Ourhub {
  // Add new hub with multiple pincodes
  async addOurhub(req, res) {
    try {
      let { hubName, areaName, pincodes } = req.body;

      if (!(hubName && areaName && pincodes && pincodes.length > 0)) {
        return res.status(400).json({ msg: "Hub name, area name, and at least one pincode are required!" });
      }

      let NewOurhub = new OurhubModel({
        hubName,
        areaName,
        pincodes,
      });
      
      await NewOurhub.save();
      return res.status(200).json({ success: "Hub added successfully", hub: NewOurhub });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to add hub" });
    }
  }

  // Get all hubs
  async getOurhub(req, res) {
    try {
      let Ourhub = await OurhubModel.find({}).sort({ createdAt: -1 });
      if (Ourhub?.length) {
        return res.status(200).json({ Ourhub: Ourhub });
      } else {
        return res.status(200).json({ Ourhub: [] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch hubs" });
    }
  }

  // Delete hub
  async deleteOurhub(req, res) {
    try {
      let remove = req.params.id;

      await OurhubModel.findOneAndDelete({ _id: remove });
      return res.json({ Success: "Hub removed successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete hub" });
    }
  }

  // Update hub
  async editOurhub(req, res) {
    try {
      let { id, hubName, areaName, pincodes } = req.body;
      let obj = {};

      if (hubName) obj.hubName = hubName;
      if (areaName) obj.areaName = areaName;
      if (pincodes && pincodes.length > 0) obj.pincodes = pincodes;

      let updateourhub = await OurhubModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (updateourhub) {
        return res.status(200).json({
          success: "Hub updated successfully",
          Ourhub: updateourhub,
        });
      } else {
        return res.status(404).json({ error: "Hub not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to update hub" });
    }
  }

  // Add pincode to existing hub
  async addPincodeToHub(req, res) {
    try {
      let { id, pincode } = req.body;

      if (!pincode) {
        return res.status(400).json({ msg: "Pincode is required!" });
      }

      let hub = await OurhubModel.findById(id);
      if (!hub) {
        return res.status(404).json({ error: "Hub not found" });
      }

      if (hub.pincodes.includes(pincode)) {
        return res.status(400).json({ msg: "Pincode already exists in this hub" });
      }

      hub.pincodes.push(pincode);
      await hub.save();

      return res.status(200).json({
        success: "Pincode added successfully",
        Ourhub: hub,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to add pincode" });
    }
  }

  // Remove pincode from hub
  async removePincodeFromHub(req, res) {
    try {
      let { id, pincode } = req.body;

      let hub = await OurhubModel.findById(id);
      if (!hub) {
        return res.status(404).json({ error: "Hub not found" });
      }

      if (hub.pincodes.length === 1) {
        return res.status(400).json({ msg: "Cannot remove the last pincode. Hub must have at least one pincode." });
      }

      hub.pincodes = hub.pincodes.filter(p => p !== pincode);
      await hub.save();

      return res.status(200).json({
        success: "Pincode removed successfully",
        Ourhub: hub,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to remove pincode" });
    }
  }
}

const Ourhubcontroller = new Ourhub();
module.exports = Ourhubcontroller;
