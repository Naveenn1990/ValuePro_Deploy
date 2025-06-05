const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const faceapi = require("face-api.js");
const helmet = require("helmet");
const compression = require("compression");
const { Canvas, Image, ImageData } = require("canvas");
const path = require("path");
var xss = require("xss");
const canvas = require("canvas");
const http = require("http");
// const { Server } = require("socket.io");
const server = http.createServer(app);
const socketIo = require("socket.io");
// establishing the connection --> setting the connection
// "mongodb://localhost:27017/coorgtour_db"


mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected........."))
  .catch((err) => console.log("Database Not Connected !!!"));

const PORT = 8000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("Public"));
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
// import route
const admin= require('./Config/firebase.js')
// const io = new Server(server, {
//   cors: {
//     // It is okay to accept socket communication with this URL
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
const JobModel = require("./Modal/Admin/job");
const Partner = require("./Modal/venor/vendor");
const User = require("./Modal/User/user")
const calls = new Map();
const rides = new Map(); // Format: { rideId: { driverId, userId, status } }



const initiateCall = async (req, res) => {
  // calls.set(callId, { callerId, receiverId, status: 'pending', offer });
  // res.json({ success: true });

    try {
      // console.log("req.body", req.body)
      const { callerId, receiverId, callId, isUser, offer, user } = req.body;

      // Validate caller and receiver
      const partner = isUser
        ? await User.findById(receiverId)
        : await Partner.findById(receiverId);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Receiver not found' });
      }

      // Store call state
      calls.set(callId, { callerId, receiverId, status: 'pending', offer });

      console.log("callerId, receiverId, callId, isUser, offer,user", callerId, receiverId, callId, isUser, offer, user)
      // Emit call initiation event to receiver's room
      const message = {
        notification: {
          title: 'Incoming Call',
          body: `Call from ${user.name}`,

        },
        android: {
          notification: {
            channel_id: 'call-channel',
            sound: "ringtone",
          },
        },
        data: {
          callId,
          callerId,
          receiverId,
          type: 'call',
          user: JSON.stringify(user),
          offer: JSON.stringify(offer),
        },
        token: partner?.mobilefcmtoken ||partner?.webfcmtoken,
      };
    
      await admin.messaging().send(message);
      console.log('Notification sent to receiver:', receiverId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error initiating call:', error);
      res.status(500).json({ success: false, message: error.message });
    }
};

// Register the only API


const fs = require("fs");
const multer = require("multer");
const storage1 = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "Public/Chat");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now() + "_" + file.originalname);
  },
});
const upload1 = multer();
app.post("/uploadChatImges", upload1.any(), async(req, res) => {
  let image = "";
  if (req.files.length != 0) {
    let arr = req.files;
    let i;
    for (i = 0; i < arr?.length; i++) {
      if (arr[i].fieldname == "image") {
        image = await uploadFile2(arr[i],"chat");
      }
    }
  } else return res.status(400).send("No file uploaded");

  return res.status(200).send({ success: image });
});

app.post('/api/initiate-call', initiateCall);
const Emmiter = require("./Controller/Emmiter.js");


io.on("connection", (socket) => {
  // Client-side socket event handling
  socket.on("CheckJob", (vendor) => {
    console.log("Checking job for vendor:", vendor);
    // Emit events to fetch and auto assign jobs for the specified vendor
    Emmiter.emitEvent("JobEvent", vendor);
    Emmiter.emitEvent("AutoAssignedJob", vendor);
  });

  // Server-side socket event handlers
  Emmiter.emitter.on("JobEvent", async (vendor) => {
    try {
      console.log("Fetching jobs for vendor:", vendor);
      let vendorAllJobs = await JobModel.find({ VendorStatus: "Flash" });
      if (vendorAllJobs.length == 0) {
        io.emit("FlashJob", [{ check: "Admin" }]);
      } else {
        io.emit("FlashJob", vendorAllJobs);
      }

    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  });

  Emmiter.emitter.on("AutoAssignedJob", async (vendor) => {
    try {
      console.log("Auto assigning jobs for vendor:", vendor);
      let vendorAssignedJobs = await JobModel.find({
        vendorId: vendor,
        VendorStatus: "Assigned",
      });
      console.log(
        "Auto assigning :",
        vendorAssignedJobs[0]?.vendorId,
        vendorAssignedJobs.length
      );
      if (vendorAssignedJobs.length == 0) {
        io.emit(`JobAssignedByVendor_${vendor}`, [{ check: "Admin" }]);
      } else {
        io.emit(`JobAssignedByVendor_${vendor}`, vendorAssignedJobs);
      }
    } catch (error) {
      console.error("Error auto assigning jobs:", error);
    }
  });

  //chat Events

  socket.on("chat message", async (message) => {
    try {
      let newChat = await JobModel.findById(message?.jobId);

      newChat.chat.push(message);

      newChat = await newChat.save();
      io.emit(`receive message client ${newChat._id}`, newChat.chat);
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });

  socket.on("receive message", async (jobId) => {
    try {
      console.log("id",jobId)
      // Find chat messages between senderId and receiverId
      let chat = await JobModel.findById(jobId);

      if (chat.chat.length > 0) {
        io.emit(`receive message client ${chat._id}`, chat.chat);
        console.log("send",chat._id)
      }
    } catch (error) {
      console.error("Error retrieving chat messages:", error);
    }
  });


  socket.on('register', ({ userId, isUser }) => {
    try {
      if (!userId) {
        throw new Error('Invalid userId');
      }
      socket.userId = userId;
      socket.isUser = isUser;
      socket.join(userId);
      console.log(`User ${userId} registered with socket ${socket.id}, rooms:`, socket.rooms);
      socket.emit('registration');
    } catch (error) {
      console.error(`Error registering user ${userId}:`, error.message);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('call_answer', async ({ callId, senderId, receiverId, answer }) => {
    try {
      const call = calls.get(callId);
      if (!call || call.status !== 'pending') {
        console.warn(`Call answer ignored for callId ${callId}: Invalid or non-pending call`);
        return;
      }

      call.status = 'active';
      calls.set(callId, call);

      // Verify receiver is in the room
      const receiverSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.userId === receiverId && s.rooms.has(receiverId)
      );
      if (!receiverSocket) {
        throw new Error('Receiver not connected');
      }

      io.to(receiverId).emit('call_answer', {
        callId,
        senderId,
        receiverId,
        answer,
      });
      console.log(`Answer sent to caller ${receiverId} for call ${callId}`);
    } catch (error) {
      console.error(`Error sending answer for call ${callId}:`, error.message);
      io.to(senderId).to(receiverId).emit('error', { message: error.message });
    }
  });

  socket.on('ice_candidate', async ({ callId, senderId, receiverId, candidate }) => {
    try {
      const call = calls.get(callId);
      if (!call) {
        console.warn(`ICE candidate ignored for callId ${callId}: Call not found`);
        return;
      }

      const receiverSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.userId === receiverId && s.rooms.has(receiverId)
      );
      if (!receiverSocket) {
        throw new Error('Receiver not connected');
      }

      io.to(receiverId).emit('ice_candidate', {
        callId,
        senderId,
        receiverId,
        candidate,
      });
      console.log(`ICE candidate sent to ${receiverId} for call ${callId}`);
    } catch (error) {
      console.error(`Error sending ICE candidate for call ${callId}:`, error.message);
      io.to(senderId).to(receiverId).emit('error', { message: error.message });
    }
  });

  socket.on('call_ended', async ({ callId, senderId, receiverId }) => {
    try {
      const call = calls.get(callId);
      if (!call) {
        console.warn(`Call end ignored for callId ${callId}: Call not found`);
        return;
      }

      call.status = 'ended';
      calls.set(callId, call);

      io.to(receiverId).emit('call_ended', {
        callId,
        senderId,
        receiverId,
      });
      console.log(`Call ended notification sent to ${receiverId} for call ${callId}`);

      calls.delete(callId);
      console.log(`Call ${callId} removed from calls Map`);
    } catch (error) {
      console.error(`Error ending call ${callId}:`, error.message);
      io.to(senderId).to(receiverId).emit('error', { message: error.message });
    }
  });

  socket.on('call_rejected', async ({ callId, senderId, receiverId }) => {
    try {
      const call = calls.get(callId);
      if (!call) {
        console.warn(`Call rejection ignored for callId ${callId}: Call not found`);
        return;
      }

      call.status = 'rejected';
      calls.set(callId, call);

      io.to(receiverId).emit('call_rejected', {
        callId,
        senderId,
        receiverId,
      });
      console.log(`Call rejection notification sent to ${receiverId} for call ${callId}`);

      calls.delete(callId);
      console.log(`Call ${callId} removed from calls Map`);
    } catch (error) {
      console.error(`Error rejecting call ${callId}:`, error.message);
      io.to(senderId).to(receiverId).emit('error', { message: error.message });
    }
  });

  socket.on('cleanup', ({ callId, userId }) => {
    try {
      if (calls.has(callId)) {
        const call = calls.get(callId);
        io.to(call.callerId).to(call.receiverId).emit('call_ended', {
          callId,
          senderId: userId,
          receiverId: call.callerId === userId ? call.receiverId : call.callerId,
        });
        calls.delete(callId);
        console.log(`Cleaned up call ${callId} for user ${userId}`);
      } else {
        console.log(`Cleanup ignored for call ${callId}: Call not found`);
      }
    } catch (error) {
      console.error(`Error cleaning up call ${callId}:`, error.message);
      socket.emit('error', { message: error.message });
    }
  });


  socket.on('start_ride', async ({ rideId, driverId, userId }) => {
    try {
      if (!rideId || !driverId || !userId) {
        throw new Error('Invalid ride details');
      }
      socket.join(driverId);
      // Store ride details
      rides.set(rideId, {
        driverId,
        userId,
        status: 'active',
      });

      // Notify user that ride has started
      io.to(userId).emit('ride_started', {
        rideId,
        driverId,
        message: 'Ride has started. Driver location tracking enabled.',
      });

      await JobModel.findByIdAndUpdate(rideId, { rideStart: true });
      console.log(`Ride ${rideId} started. Driver: ${driverId}, User: ${userId}`);
    } catch (error) {
      console.error(`Error starting ride ${rideId}:`, error.message);
      socket.emit('error', { message: error.message });
    }
  });

  // New: Driver sends location updates
  socket.on('driver_location', async ({ rideId, latitude, longitude }) => {
    try {
      const ride = rides.get(rideId);
      if (!ride || ride.status !== 'active') {
        console.warn(`Location update ignored for rideId ${rideId}: Invalid or non-active ride`);
        return;
      }
 console.log(`Ride Driver location  update`);
      // Verify driver is the one sending the update
      if (ride.userId === ride.driverId) {
        throw new Error('Unauthorized location update ' + ride.userId +
          " " + ride.driverId
        );
      }

      // Send location to user
      io.to(ride.userId).emit('driver_location_update', {
        rideId,
        driverId: ride.driverId,
        latitude,
        longitude,
        timestamp: Date.now(),    
      });
      await Partner.findByIdAndUpdate(ride.driverId, { latitude, longitude });
      console.log(`Driver location sent for ride ${rideId}: (${latitude}, ${longitude}) to user ${ride.userId}`);
    } catch (error) {
      console.error(`Error sending driver location for ride ${rideId}:`, error.message, latitude,
        longitude);
      socket.emit('error', { message: error.message });
    }
  });
  socket.on('ride_check', async ({ rideId }) => {
    try {
      const ride = rides.get(rideId);
      if (!ride) {
        console.warn(`Ride check ignored for rideId ${rideId}: Ride not found`);
        return;
      }
      socket.join(ride.userId)
      console.log(`ride_check Ride ${rideId} is active`);
      io.to(ride.driverId).emit('ride_check', {
        rideId,
        message: 'Ride is active',
      });
      let driver = await Partner.findById(ride.driverId);
      io.to(ride.userId).emit(' ', {
        rideId,
        message: 'Ride is active',
        driverLocation: {
          latitude: driver.latitude,
          longitude: driver.longitude,
        },
      });
      console.log(`Ride ${rideId} is active`);
    } catch (error) {
      console.error(`Error checking ride ${rideId}:`, error.message);
      socket.emit('error', { message: error.message });
    }
  })

  socket.on('route_created', (data) => {
    console.log('Route created:', data);
    try {
      const { rideId, userId, initialEta, destination } = data;
      const ride = rides.get(rideId);
      // Store route info in database
      // ...

      // Forward to user
      // console.log("ride && ride.userId",ride,ride.userId)

      if (ride && ride.userId) {
        io.to(ride.userId).emit('route_info', {
          rideId,
          eta: initialEta,
          destination,
          status: 'active'
        });
      }
    } catch (error) {
      console.error(`Error creating route ${rideId}:`, error.message);
      socket.emit('error', { message: error.message });
    }

  });

  socket.on('eta_update', (data) => {
    const { rideId, userId, etaInfo } = data;
    const ride = rides.get(rideId);
    // Update ETA in database
    // ...

    // Forward ETA to user
    console.log('eta_update:', data);

    if (userId) {
      console.log("sending",userId)
      io.to(userId).emit('eta_update', {
        rideId,
        eta: etaInfo,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('route_changed', (data) => {
    const { rideId, userId } = data;
    const ride = rides.get(rideId);
    // Record route change in database
    // ...
  console.log('route_changed:', data);
    // Notify user about route change
    const userSocketId = ride[userId];
    if (userSocketId) {
      io.to(userSocketId).emit('route_changed', {
        rideId,
        message: 'Driver has taken a different route',
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('driver_arrived', (data) => {
    const { rideId, userId, isFinalDestination } = data;
    // Update ride status in database
    // ...
    // Notify user
      console.log('driver_arrived:', data);
    const ride = rides.get(rideId);
    const userSocketId = ride[userId];
    if (userSocketId) {
      io.to(userSocketId).emit('driver_arrived', {
        rideId,
        isFinalDestination,
        message: isFinalDestination ?
          'You have arrived at your destination' :
          'Approaching waypoint',
        timestamp: new Date().toISOString()
      });
    }
  });
  // New: End ride
  socket.on('end_ride', async ({ rideId }) => {
        console.log('end_ride:', rideId);
    try {
      const ride = rides.get(rideId);
      if (!ride) {
        console.warn(`End ride ignored for rideId ${rideId}: Ride not found`);
        return;
      }

      // Update ride status
      ride.status = 'ended';
      rides.set(rideId, ride);

      // Notify user that ride has ended
      io.to(ride.userId).emit('ride_ended', {
        rideId,
        message: 'Ride has ended.',
      });
      await JobModel.findByIdAndUpdate(rideId, { rideStart: false });
      // Optionally, remove ride from map after some time
      setTimeout(() => {
        rides.delete(rideId);
        console.log(`Ride ${rideId} removed from active rides`);
      }, 1000); // Remove after 1 minute

      console.log(`Ride ${rideId} ended. Notified user ${ride.userId}`);
    } catch (error) {
      console.error(`Error ending ride ${rideId}:`, error.message);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('route_polyline', (data) => {
    const { rideId, userId, polyline, polylineCoordinates } = data;

    // console.log(`Received route polyline data for ride ${rideId} from user ${userId} polyline: ${polyline} polylineCoordinates: ${polylineCoordinates}`);

    // Store polyline in database (optional)
    // This can be useful for ride history or analytics
    // storeRoutePolyline(rideId, polyline || polylineCoordinates)
    //   .catch(err => console.error('Error storing polyline:', err));
    try {
      const ride = rides.get(rideId);
      const userSocketId = ride.userId;
      if (userSocketId) {
        io.to(userSocketId).emit('route_polyline_update', {
          rideId,
          // If we received an encoded polyline, send it as is
          polyline: polyline,
          // If we received coordinates array, send it as is
          polylineCoordinates: polylineCoordinates,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error storing polyline for ride ${rideId}:`, error.message);
      socket.emit('error', { message: error.message });
    }
    // Forward to user

  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models/models"),
  faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models/models"),
])
  .then(() => {
    console.log("Face recognition models loaded.");
  })
  .catch((err) => console.log("eeeee", err));

async function LoadModels() {
  // Load the models
  // __dirname gives the root directory of the server
  await faceapi.nets.faceRecognitionNet.loadFromDisk(
    __dirname + "/models/models"
  );
  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    __dirname + "/models/models"
  );
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models/models");
}
LoadModels();

const FaceModel = require("./Modal/Face");

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "Public/Face");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({storage:storage});
//Face upload images Api
app.post("/faceimageUpload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
     
    let userId = req.body.userId;
    if (!userId)
      return res.status(400).json({ error: "Please enter your userId" });
    let check = await FaceModel.findOne({ userId: userId });
    if (check) return res.status(400).json({ error: "Already uploaded" });
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();
       const imgstore=req.file.filename
    let data = await FaceModel.create({
      userId: userId,
      faceDescriptor: detections[0]?.descriptor,
      image: imgstore,
    });
    return res.status(200).json({ success: detections });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});
//updated face images Api
app.put("/updateFaceImaes", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    console.log(imagePath,'lsaldlas')
    let userId = req.body.userId;
    let check = await FaceModel.findOne({ userId: userId });
    if (!check) return res.status(400).json({ error: "Data not found" });

    const img = await canvas.loadImage(imagePath);
    console.log(img,"uuuuuu");
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();
    // console.log(detections,'lsaldlas')
 const imgstore=req.file.filename
    let data = await FaceModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          faceDescriptor: detections[0]?.descriptor,
          image: imgstore,
        },
      }
    );

    return res.status(200).json({ success: "Successfully updated" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});
//Face Match Api
app.post("/FaceMatch", upload.single("image"), async (req, res) => {
  try {
    try {
      const imagePath = req.file.path;
      let userId = req.body.userId;
      let data = await FaceModel.findOne({ userId: userId });
      if (!data) return res.status(400).json({ error: "Data not found" });
      const existingFaceDescriptor = Object.values(data.faceDescriptor[0]);
      //  console.log("existingFaceDescriptor",existingFaceDescriptor);
      const img = await canvas.loadImage(imagePath);
      const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const distance = faceapi.euclideanDistance(
        existingFaceDescriptor,
        detections[0]?.descriptor
      );
      const similarityThreshold = 0.6; // Adjust this
      // console.log("distance",distance);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        }
        console.log("File deleted successfully.");
      });
      if (distance < similarityThreshold) {
        // The new face matches the existing face
        return res.status(200).json({ success: "Face match found!" });
      } else {
        // The new face does not match any existing face
        return res.status(400).json({ error: "No face match found." });
      }
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/getAuthenticateFacebyVendor/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await FaceModel.findOne({ userId: id });
    if (!data) return res.status(400).json({ error: "Face not found" });
    return res.status(200).json({ success: data });
  } catch (error) {
    console.log(error);
  }
});

const userRoute = require("./Routes/User/user");
const adminRoute = require("./Routes/Admin/Admin1");
const bannerRoute = require("./Routes/Admin/Banner1");
const createhubRoute = require("./Routes/Admin/Createhub");
const ourhubRoute = require("./Routes/Admin/Ourhub");
const protimingRoute = require("./Routes/Admin/Protiming");
const pincodeRoute = require("./Routes/Admin/Pincode");
const CategoryRoute = require("./Routes/Admin/Category1");
const OffersRoute = require("./Routes/Admin/Offers1");
const vendor = require("./Routes/vendor/vendor");
const wallet = require("./Routes/vendor/wallet");
const product = require("./Routes/Admin/product");
const jobs = require("./Routes/Admin/jobs");
const payment = require("./Routes/Admin/payment");
const Service = require("./Routes/Admin/Service1");
const referral = require("./Routes/Admin/referralAmount");
const expanseType = require("./Routes/Admin/expenseType");
const expanse = require("./Routes/Admin/expanse");
const jobPackage = require("./Routes/vendor/jobPackage");
const Subscribed = require("./Routes/vendor/subscribe");
const cart = require("./Routes/Admin/cart");
const Address = require("./Routes/Admin/Address");
const Subcate = require("./Routes/Admin/SubCategory");
const Order = require("./Routes/Admin/orderProduct");
const Leave = require("./Routes/Admin/Leave");
const Notifications = require("./Routes/Admin/Notifications");
const videoRoutes = require('./Routes/Admin/Videoadmin');

const Contact = require("./Routes/Admin/Contact");
const FAQ = require("./Routes/Admin/FAQ");
const SocialMedias = require("./Routes/Admin/SocialMedias");
const Enquiry = require("./Routes/User/Enquiry");
const About = require("./Routes/Admin/About");
const VisionMision = require("./Routes/Admin/VisionMission");
const Whychooseus = require("./Routes/Admin/WhyChooseUs");
const Whatpeoplesay = require("./Routes/Admin/Whatpeoplesay");
const Prorequest = require("./Routes/User/ProRequest");
const Trusted = require("./Routes/Admin/Trusted");
const Counts = require("./Routes/Admin/Counts");
const Slotbooking = require("./Routes/Admin/Slotbooking");
const RevisitRequest = require("./Routes/User/ProRequest");
const phonepay = require('./Routes/User/phonepayRoutes');
const { uploadFile2 } = require("./Config/AWS.js");
// create route

// User
app.use("/api/admin", Notifications);
app.use("/api/admin", Leave);
app.use("/api/admin", Order);
app.use("/api/admin", Subcate);
app.use("/api/admin", Address);
app.use("/api/admin", cart);
app.use("/api/vendor", Subscribed);
app.use("/api/vendor", jobPackage);
app.use("/api/admin", expanseType);
app.use("/api/admin", expanse);
app.use("/api/admin", referral);
app.use("/api/admin", payment);
app.use("/api/user", phonepay);
app.use("/api/user", userRoute);
app.use("/api/vendor", vendor);
app.use("/api/vendor", wallet);
app.use("/api/admin", product);
app.use("/api/admin", jobs);
app.use("/api/admin", Service);
// Admin
app.use("/api/admin", adminRoute);
app.use("/api/admin", bannerRoute);
app.use("/api/admin", CategoryRoute);
app.use("/api/admin", OffersRoute);
app.use("/api/admin", createhubRoute);
app.use("/api/admin", pincodeRoute);
app.use("/api/admin", ourhubRoute);
app.use("/api/admin", protimingRoute);
app.use("/api/admin", videoRoutes);
app.use("/api/admin", Contact);
app.use("/api/admin", FAQ);
app.use("/api/admin", SocialMedias);
app.use("/api/User", Enquiry);
app.use("/api/admin", About);
app.use("/api/admin", VisionMision);
app.use("/api/admin", Whychooseus);
app.use("/api/admin", Whatpeoplesay);
app.use("/api/User", Prorequest);
app.use("/api/admin", Trusted);
app.use("/api/admin", Counts);
app.use("/api/admin", Slotbooking);
app.use("/api/user", RevisitRequest);
// Socket.IO event handlers

sanitizeString = (str) => {
  return xss(str);
};

app.get("/", (req, res) => {
  res.send("Welcome to Value Pro Services!");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
