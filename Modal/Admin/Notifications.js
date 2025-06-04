const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const admin = require('firebase-admin');
const vendorModel = require("../venor/vendor")
const userModel = require("../User/user");
const Notifications = new Schema(
  {
    title: {
      type: String,
    },
    userid: {
      type: String,
    },

    comment: {
      type: String,
    },
    Amount: {
      type: Number,
    },
    alert: {
      type: String,
      default: false,
    },
    notificationseen: {
      type: String,
      default: "Unseen",
    },
  },
  { timestamps: true }
);
Notifications.post("save", async function (doc) {
  try {
    const userIdString = doc.userid;
    const user = await userModel.findById(userIdString);
    const vendor = await vendorModel.findById(userIdString);
    let token = "";
    if (user) {
      token = user.mobilefcmtoken || user.webfcmtoken
    } else if (vendor) {
      token = vendor.fcmtoken
    }
    if (token) {
  const userMessage = {
      notification: {
        title: doc.title,
        body: doc.comment.length > 100 ? doc.comment.slice(0, 97) + '...' : doc.message, // Truncate to avoid size issues
      },
      data: {
        type: 'new-notification',
        userId: userIdString,
        title: doc.title,
        message: doc.comment.length > 100 ? doc.comment.slice(0, 97) + '...' : doc.message,
        timestamp: new Date().toISOString(),
      },
      token: token,
      "android": {
        "priority": "high",
        "ttl": 86400
      },
      "apns": {
        "payload": {
          "aps": {
            "contentAvailable": true
          }
        },
        "headers": {
          "apns-priority": "5"
        }
      }
    };

    // Validate payload size (4KB = 4096 bytes)
    const payloadString = JSON.stringify(userMessage);
    const payloadSize = Buffer.byteLength(payloadString, 'utf8');
    if (payloadSize > 4096) {
      console.log(
        `FCM payload too large for partner ${userIdString}: ${payloadSize} bytes`,
      );
      // Fallback to minimal payload
      userMessage.notification.body = userMessage.notification.body.slice(0, 50) + '...';
      userMessage.data.message = userMessage.data.message.slice(0, 50) + '...';
      const fallbackSize = Buffer.byteLength(JSON.stringify(userMessage), 'utf8');
      if (fallbackSize > 4096) {
        console.error(
          `Fallback FCM payload still too large for partner ${userIdString}: ${fallbackSize} bytes`,
        );
        return;
      }
    }

    console.log(`Sending FCM notification to partner: ${userIdString}`);
    await admin.messaging().send(userMessage);
    console.log(`FCM notification sent to partner: ${userIdString}`);
    }
  } catch (error) {
    console.log(error)
  }
});
const NotificationsModel = mongoose.model("Notifications", Notifications);
module.exports = NotificationsModel;
