const NotificationsModel = require("../../Modal/Admin/Notifications");
class Notifications {
  async addNotification(req, res) {
    try {
      let { title, Status, Amount, comment,  } = req.body;
      let data = await NotificationsModel.create({
        title,
        Status,
        Amount,
        comment,
       
      });
      if (!data) return res.status(400).json({ error: "Something went wrong" });
      return res.status(200).json({ success: "Added Notifications Success" });
    } catch (error) {
      console.log(error);
    }
  }
  async updateNotification(req, res) {
    try {
      let data = await NotificationsModel.updateMany({ _id:_id });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async getNotification(req, res) {
    try {
      let data = await NotificationsModel.find().sort({ _id:_id });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async getNotificationbyId(req, res) {
    try {
      let id = req.params.id;
      let data = await NotificationsModel.find({userid:id});
      // if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async updateNotificationseen(req, res) {
       const notificationId = req.params.id;
  
  try {
    // Find the notification by ID
    const notification = await NotificationsModel.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Update the notificationseen field to "Seen"
    notification.notificationseen = "Seen";

    // Save the updated notification
    await notification.save();

    // Respond with success message
    res.json({ message: "Notification marked as seen" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
    
  }
}

const NotificationsController = new Notifications();
module.exports = NotificationsController;
