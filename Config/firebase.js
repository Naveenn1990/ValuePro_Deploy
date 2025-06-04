const admin = require("firebase-admin");
const serviceAccount = require("../firebase-admin.json"); // Path to your JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://value-pro-badc3-default-rtdb.asia-southeast1.firebasedatabase.app/valuepro" // Optional (if using Realtime DB)
});

module.exports = admin;