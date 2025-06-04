const express = require("express");
const router = express.Router();
const NotificationsController = require("../../Controller/Admin/Notifications");

router.post("/addNotification", NotificationsController.addNotification);
router.get("/getNotification", NotificationsController.getNotification);
router.get("/getNotificationbyId/:id", NotificationsController.getNotificationbyId);
router.put("/updateNotification",NotificationsController.updateNotification)
router.put("/notifications/:id",NotificationsController.updateNotificationseen)

module.exports = router;
