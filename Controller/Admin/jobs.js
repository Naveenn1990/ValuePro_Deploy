const jobsModel = require("../../Modal/Admin/job");
const NotificationsModel = require("../../Modal/Admin/Notifications");
const vendorModel = require("../../Modal/venor/vendor");
const commissionModel=require("../../Modal/Admin/commission");
const moment = require("moment");
const { emitter, emitEvent } = require("../Emmiter");
const { uploadFile2 } = require("../../Config/AWS");

async function assignedJobAuto(id) {
  try {
    if (!id) {
      console.log("Invalid or missing job ID in request:", id);
      return console.log("Missing or invalid job ID");
    }

    const job = await jobsModel.findOne({ _id: id });

    if (!job) {
      return console.log("Job not found");
    }

    // Check if the job has already been accepted
    if (job.VendorStatus === "Accepted") {
      return console.log("Job has already been accepted, no need to assign.");
    }
    // AvRating:{ $gt: 4.5 }
    const jobPincode = job.pincode;
    let vendors = await vendorModel.find({
      assignmentHubPincode: job.pincode,
      isBlock: false,$or:[{AvRating:{ $gt: 4.5 }},{ResponseRate:{$lt:20}}]
    });
 
    vendors = vendors.filter(
      (item) =>
        item.TimeOn &&
        !item.TimeOn.some(
          (ele) => ele.date === job.serviceDate && ele.time == job.serviceTime
        )
    );

    if (vendors.length === 0) {
      let job2 = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { VendorStatus: "Flash", jobType: "Flash" } }
      );
      try {
        emitEvent("JobEvent", "Vendor");
      } catch (error) {
        console.log(error);
      }

      return console.log("A No vendors found within the same pincode");
    }

    for (const vendor of vendors) {
      // Skip if the job has already been assigned to the current vendor
      if (job.vendorId === vendor._id) {
        unassignJobFromVendor(job);
        continue;
      }
      // Check if the subscription days limit has been exceeded
      // const subscriptionExpiry = new Date(vendor.subscriptionTime);
      // subscriptionExpiry.setDate(subscriptionExpiry.getDate() + vendor.subscriptionDays);

      // if (subscriptionExpiry <= new Date()) {
      //   console.log(`Vendor ${vendor.name}'s subscription has expired. Skipping assignment.`);
      //   continue;
      // }
      let VendorJobCheck=await jobsModel.findOne({vendorId:vendor._id,serviceDate:job.serviceDate,serviceTime:job.serviceTime,$or:[{status:"Confirmed"},{status:"Pending"},{status:"Work Start"},{status:"Pause"},{status:"Quotation Request"}]});
      if(VendorJobCheck){
          continue;
      }
       await assignJobToVendor(id, vendor);
      await delay(2 * 60 * 1000); // 15 minutes delay
 
      // Check if the job is still pending and reassign if necessary
      const updatedJob = await jobsModel.findById(id);
      if (updatedJob && updatedJob.VendorStatus !== "Accepted") {
        console.log("Vendor delete", updatedJob.vendorId);

        await unassignJobFromVendor(updatedJob);
      } else {
        // If the job has been accepted, break out of the loop
        break;
      }
    }
    let check = await jobsModel.findById(id);
    if (check.VendorStatus !== "Accepted") {
      let job2 = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { VendorStatus: "Flash", jobType: "Flash" } }
      );
      emitEvent("JobEvent", "vendor");
    }

    return console.log("B Job assigned to vendors within the same pincode");
  } catch (error) {
    console.error(error);
  }
}

async function assignJobToVendor(jobId, vendor) {
  let job = await jobsModel.findOneAndUpdate(
    { _id: jobId },
    {
      $set: {
        vendorId: vendor._id,
        VendorStatus: "Assigned",
        assignmentTime: new Date(),
        jobType: "Auto",
      },
    }
  );
  job.JobAssignedVendor.push({
    vendorId: vendor._id,
    vendorName: vendor.name,
    vendorMobile: vendor.mobile,
    status: "Auto",
  });
  await job.save();
  console.log("Assign vendor for", vendor._id);
  emitEvent(`AutoAssignedJob`, vendor._id);
}

async function unassignJobFromVendor(job) {
  let jobVendor = job.vendorId;
  if (jobVendor) {
    console.log(jobVendor);
    job.vendorId = null;
    job.VendorStatus = "Pending";
    await job.save();
    console.log("Vendor delete", jobVendor);
    emitEvent(`AutoAssignedJob`, jobVendor);
  } else console.log(jobVendor);
  job.vendorId = null;
  job.VendorStatus = "Pending";
  await job.save();
  console.log("Vendor delete", jobVendor);
  emitEvent(`AutoAssignedJob`, jobVendor);

  await delayForNewAss(2 * 1000);
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delayForNewAss(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Jobs {
  async AddJobsService(req, res) {
    try {
      let {
        userId,
        userName,
        serviceAmount,
        userMobile,
        userEmail,
        userAddress,
        houseno,
        landmark,
        placeAddress,
        vendorId,
        vendorName,
        vendorMobile,
        TotalAmount,
        gst,
        discount,
        serviceDate,
        serviceTime,
        serviceType,
        servecePoint,
        serviceRemark,
        payAmount,
        paymentStatus,
        payId,
        paymentMethod,
        pincode,
        latitude,
        longitude,
        Avoidcallingbefore,
        jobcommision,
      } = req.body;
      
       const commissionData = await commissionModel.findOne();
       const serviceCommission = commissionData?.seramt || 0;
       const productCommission = commissionData?.productpr || 0;
       const productCommissionCut = TotalAmount * (productCommission / 100);
       const finalTotalAmount = TotalAmount - productCommissionCut;

      let data = await jobsModel.create({
        userId,
        serviceAmount,
        userName,
        userMobile,
        userEmail,
        vendorId,
        vendorName,
        vendorMobile,
        TotalAmount,
        gst,
        discount,
        serviceDate,
        serviceTime,
        serviceType,
        servecePoint,
        serviceRemark,
        userAddress,
        houseno,
        landmark,
        placeAddress,
        payAmount,
        paymentStatus,
        payId,
        paymentMethod,
        pincode,
        Avoidcallingbefore,
        jobcommision,
        location: { type: "Point", coordinates: [longitude, latitude] },
        servicecommission: serviceCommission,
        productcommission: finalTotalAmount,
      });

      if (!data) return res.status(400).json({ error: "Something went wrong" });
      assignedJobAuto(data?._id);
      return res
        .status(200)
        .json({ success: "Successfully added", id: data?._id });
    } catch (error) {
      console.log(error);
    }
  }

  async updateJobs(req, res) {
    try {
      let {
        userId,
        serviceRemark,
        userName,
        userMobile,
        serviceAmount,
        userEmail,
        vendorId,
        vendorName,
        vendorMobile,
        TotalAmount,
        gst,
        discount,
        serviceDate,
        serviceTime,
        serviceType,
        jobcommision,
      } = req.body;
      if(jobcommision){
          obj["jobcommision"]=jobcommision
      }
      if (serviceRemark) {
        obj["serviceRemark"] = serviceRemark;
      }
      if (userId) {
        obj["userId"] = userId;
      }
      if (userName) {
        obj["userName"] = userName;
      }
      if (serviceAmount) {
        obj["serviceAmount"] = serviceAmount;
      }
      if (userMobile) {
        obj["userMobile"] = userMobile;
      }
      if (userEmail) {
        obj["userEmail"] = userEmail;
      }
      if (vendorId) {
        obj["vendorId"] = vendorId;
      }
      if (vendorName) {
        obj["vendorName"] = vendorName;
      }
      if (vendorMobile) {
        obj["vendorMobile"] = vendorMobile;
      }
      if (TotalAmount) {
        obj["TotalAmount"] = TotalAmount;
      }
      if (gst) {
        obj["gst"] = gst;
      }
      if (discount) {
        obj["discount"] = discount;
      }
      if (serviceDate) {
        obj["serviceDate"] = serviceDate;
      }
      if (serviceType) {
        obj["serviceType"] = serviceType;
      }
      if (serviceTime) {
        obj["serviceTime"] = serviceTime;
      }
      let data = await jobsModel.findOneAndReplace(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }
  async getAllJobs(req, res) {
    try {
      let data = await jobsModel.find().sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async getJobsById(req, res) {
    try {
      let id = req.params.id;
      let data = await jobsModel.findById(id);
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async assignVendorJobs(req, res) {
    try {
      let { id, vendorName, vendorMobile, vendorId, VendorStatus } = req.body;
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            vendorName,
            vendorMobile,
            vendorId,
            VendorStatus: VendorStatus,
            AssignedBy: "ADMIN",
          },
        },
        { new: true }
      );

      if (!data) return res.status(400).json({ error: "Data not found" });
      data.JobAssignedVendor.push({
        vendorId: vendorId,
        vendorName: vendorName,
        vendorMobile: vendorMobile,
        status: "ADMIN",
      });
      data.save();
      await NotificationsModel.create({
        title: "Job Assigned",
        userid: vendorId,
        Amount: data?.TotalAmount,
        comment: `Admin assined you new job user-name ${data?.userName} and user-address ${data?.userAddress}`,
      });
      emitEvent(`AutoAssignedJob`, vendorId);
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async assignVendorRejectAndAccept(req, res) {
    try {
      let { id, vendorName, vendorMobile, vendorId, VendorStatus } = req.body;

      let data = await jobsModel.findOne({ _id: id, VendorStatus: "Accepted" });
      if (data) return res.status(400).json({ error: "Already accepted" });

      let check = await jobsModel.findOne({ _id: id });
      if (!check) return res.status(400).json({ error: "Data Not found" });
      let am = await vendorModel.findById(vendorId);
      if (VendorStatus == "Accepted") {
        if (
          check?.VendorStatus == "Flash" &&
          am.assignmentHubPincode !== check.pincode
        ) {
          check.JobAssignedVendor.push({
            vendorId: vendorId,
            vendorName: vendorName,
            vendorMobile: vendorMobile,
          });
        }
        am.ResponseRate = am.ResponseRate + 1;
        am.save();
        check.vendorId = vendorId;
        check.vendorMobile = vendorMobile;
        check.vendorName = vendorName;
        check.VendorStatus = "Accepted";
        check.status = "Confirmed";
        await check.save();
        return res.status(200).json({ success: "Successfully accepted" });
      }
      check.JobRejectVendor.push({
        vendorName: vendorName,
        vendorMobile: vendorMobile,
        vendorId: vendorId,
      });
      if (
        check?.VendorStatus == "Flash" &&
        am.assignmentHubPincode !== check.pincode
      ) {
        check.JobAssignedVendor.push({
          vendorId: vendorId,
          vendorName: vendorName,
          vendorMobile: vendorMobile,
        });
      }
      let job = await check.save();
      unassignJobFromVendor(job);
      return res.status(200).json({ success: "Successfully rejected" });
    } catch (error) {
      console.log(error);
    }
  }

  async MakeCancelAssigendVendor(req, res) {
    try {
      let { id } = req.body;
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { vendorName: "", vendorMobile: "", VendorStatus: "Pending" } },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully cancel" });
    } catch (error) {
      console.log(error);
    }
  }

  async makeCompleteJobs(req, res) {
    try {
      let { id, status } = req.body;

      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { VendorStatus: status, status: status } }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      let am = await vendorModel.findById(data.vendorId);
      am.DeliveryRate =
        am.DeliveryRate >= 5 ? am.DeliveryRate : am.DeliveryRate + 1;
      am.save();
      await NotificationsModel.create({
        title: "Job Complete",
        userid: data?.vendorId,
        Amount: data?.TotalAmount,
        comment: `₹ assined job Completed by${data?.vendorName} and Customer ${data?.userName} and user-address ${data?.userAddress}`,
      });

      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }
  
  //Create Cotation
    async CreateCotisonFromVendor(req, res) {
    try {
      let { id, TotalAmount, serviceRemark } = req.body;
      let job = await jobsModel.findById(id);
      if (!job) return res.status(400).json({ error: "Job not found" });
      if (TotalAmount) {
        job.RequestAmount = TotalAmount;
      }
      if (serviceRemark) {
        job.serviceRemark = serviceRemark;
      }
      job.cotision="Requested"
      job.status="Quotation Request"
   job=await  job.save()
      return res.status(200).json({success:job,msg:"Successfully updated"})
    } catch (error) {
      console.log(error);
    }
  }

  // Accept cotision
  async makecotision(req, res) {
    try {
      let { id ,RequestAmount} = req.body;

      let data = await jobsModel.findById(id);

      if (!data) return res.status(400).json({ error: "Data not found" });
        data.cotision="Approved"
        
        data.TotalAmount=data.TotalAmount+Number(RequestAmount);
        data.payAmount=data.payAmount+Number(RequestAmount);
        data=await data.save();
      await NotificationsModel.create({
        title: "Quotation Approved",
        userid: data?.vendorId,
        Amount: data?.TotalAmount,
        comment: `₹ assigned job cotision by ${data?.vendorName} and Customer ${data?.userName}`,
      });

      return res
        .status(200)
        .json({ success: "Quotation accepted successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  // Reject cotision
  async rejectcotision(req, res) {
    try {
      let { id } = req.body;

      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { cotision: "rejected" } } // Assuming 'rejected' as the status
      );

      if (!data) return res.status(400).json({ error: "Data not found" });

      await NotificationsModel.create({
        title: "Quotation Rejected",
        userid: data?.vendorId,
        Amount: data?.RequestAmount,
        comment: `₹ rejected job cotision by ${data?.vendorName} and Customer ${data?.userName}`,
      });

      return res
        .status(200)
        .json({ success: "Quotation rejected successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async addProductVendor(req, res) {
    try {
      let { id, productId, price, quntitity, name, actualPrice } = req.body;
      let obj = { productId, price, quntitity, name, actualPrice };
      let check = await jobsModel.findById(id);
      if (!check) return res.status(400).json({ error: "Data not found" });
      let am = check?.servecePoint?.filter(
        (ele) => ele?.productId?.toString() == productId.toString()
      );
      if (am.length != 0) {
        check = await jobsModel.findOneAndUpdate(
          { _id: id },
          { $pull: { servecePoint: { productId: productId } } },
          { new: true }
        );
      }

      check = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $push: { servecePoint: obj } },
        { new: true }
      );
      let amount =
        Number(check?.serviceAmount) +
        Number(check?.servecePoint?.reduce((a, item) => a + item?.price, 0));
      check = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { TotalAmount: amount } },
        { new: true }
      );

      await NotificationsModel.create({
        title: "Add Product",
        userid: check?.vendorId,
        Amount: check?.TotalAmount,
        comment: `₹ Product Name ${name} add  by${check?.vendorName} and Customer  ${check?.userName}`,
      });

      return res.status(200).json({ success: check });
    } catch (error) {
      console.log(error);
    }
  }

  async removeProduct(req, res) {
    try {
      let { id, productId, price } = req.body;
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $pull: { servecePoint: { productId: productId } } }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { TotalAmount: Number(data?.TotalAmount) - Number(price) } }
      );
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }

  async addServiceVendor(req, res) {
    try {
      let { id, serviceId, price, quntitity, name, actualPrice } = req.body;
      let obj = { serviceId, price, quntitity, name, actualPrice };
      let check = await jobsModel.findById(id);
      if (!check) return res.status(400).json({ error: "Data not found" });
       let am = check?.serviceType?.filter(
        (ele) => ele?.serviceId?.toString() == serviceId.toString()
      );
      if (am.length != 0){
        check = await jobsModel.findOneAndUpdate(
          { _id: id },
          { $pull: { serviceType: { serviceId: serviceId } } },
          { new: true }
        );
      }

      check = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $push: { serviceType: obj } },
        { new: true }
      );
      let serViceAmount=Number(check?.serviceType?.reduce((a, item) => a + item?.price, 0));
      let amount =serViceAmount+Number(check?.servecePoint?.reduce((a, item) => a + item?.price, 0));
      check = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { TotalAmount: amount,serviceAmount:serViceAmount } },
        { new: true }
      );

      await NotificationsModel.create({
        title: "Add Service",
        userid: check?.vendorId,
        Amount: check?.TotalAmount,
        comment: `₹ Service Name ${name} add  by${check?.vendorName} and Customer  ${check?.userName}`,
      });

      return res.status(200).json({ success: check });
    } catch (error) {
      console.log(error);
    }
  }

  async removeService(req, res) {
    try {
      let { id, serviceId, price } = req.body;
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        { $pull: { serviceType: { serviceId: serviceId } } }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      await jobsModel.findOneAndUpdate(
        { _id: id },
        { $set: { TotalAmount: Number(data?.TotalAmount) - Number(price),serviceAmount:Number(data?.serviceAmount) - Number(price) } }
      );
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }


  async getJobsByVendorId(req, res) {
    try {
      let id = req.params.id;
      let data = await jobsModel.find({ vendorId: id }).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

   async uploadFourImageStartJob(req, res) {
    try {
      let { id } = req.body;
      let data = await jobsModel.findById(id);
      if (!data) return res.status(400).json({ error: "Data not found" });
      let Chats = data.chat;
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "Image1") {
            let img=await uploadFile2(arr[i],"chat")
            data.Image1 = img;
            Chats.push({ id: Chats.length,
              image: img,
              fromUser: true,
              sendId: data.vendorId,
              text:"Start Job Image 1",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format('LLL'),
              name: data?.name,})
          }
          if (arr[i].fieldname == "Image2") {
             let img2=await uploadFile2(arr[i],"chat")
            data.Image2 = img2;
            Chats.push({ id: Chats.length,
              image: img2,
              fromUser: true,
              sendId: data.vendorId,
              text:"Start Job Image 2",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format('LLL'),
              name: data?.name,})
          }
          if (arr[i].fieldname == "Image3") {
             let img23=await uploadFile2(arr[i],"chat")
            data.Image3= img23;
            Chats.push({ id: Chats.length,
              image: img23,
              fromUser: true,
              sendId: data.vendorId,
              text:"Start Job Image 3",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format('LLL'),
              name: data?.name,})
          }
          if (arr[i].fieldname == "requestProof") {
             let imgrq=await uploadFile2(arr[i],"chat")
            data.requestProof = imgrq;
            Chats.push({ id: Chats.length,
              image: imgrq,
              fromUser: true,
              sendId: data.vendorId,
              text:"Request Proof",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format('LLL'),
              name: data?.name,})
          }
          if (arr[i].fieldname == "Image4") {
              let img4=await uploadFile2(arr[i],"chat")
            data.Image4 = img4;
            data.uploadImage = true;
            Chats.push({ id: Chats.length,
              image: img4,
              fromUser: true,
              sendId: data.vendorId,
              text:"Start Job Image 4",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format('LLL'),
              name: data?.name,})
      
          }
        }
      }
      data.VendorStatus = "Work Start";
      data.status = "Work Start";
      data.chat=Chats;
      await data.save();
      await NotificationsModel.create({
        title: "Start job upload Images",
        userid: data?.vendorId,
        Amount: "",
        comment: `Uploaded by${data?.vendorName} and Customer ${data?.userName} and user-address ${data?.userAddress}`,
      });

      return res.status(200).json({ success: "Successfully uploaded" });
    } catch (error) {
      console.log(error);
    }
  }

   async uploadFourImageHandOverJob(req, res) {
    try {
      let { id } = req.body;
      let data = await jobsModel.findById(id);
      if (!data) return res.status(400).json({ error: "Data not found" });
      let Chats = data.chat;
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "handOverImage1") {
              let imghd=await uploadFile2(arr[i],"chat")
            data.handOverImage1 = imghd;
            Chats.push({
              id: Chats.length,
              image: imghd,
              fromUser: true,
              sendId: data.vendorId,
              text: "Customer Signature on motherboard",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format("LLL"),
              name: data?.name,
            });
          }
          if (arr[i].fieldname == "handOverImage2") {
              let imghd2=await uploadFile2(arr[i],"chat")
            data.handOverImage2 = imghd2;
            Chats.push({
              id: Chats.length,
              image: imghd2,
              fromUser: true,
              sendId: data.vendorId,
              text: "Post Job Laptop Check",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format("LLL"),
              name: data?.name,
            });
          }
          if (arr[i].fieldname == "handOverImage3") {
              let imghd3=await uploadFile2(arr[i],"chat")
            data.handOverImage3 =imghd3;
            Chats.push({
              id: Chats.length,
              image:imghd3,
              fromUser: true,
              sendId: data.vendorId,
              text: "Post Job Laptop Check for Physical Condition",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format("LLL"),
              name: data?.name,
            });
          }
          if (arr[i].fieldname == "handOverImage4") {
              let imghd4=await uploadFile2(arr[i],"chat")
            data.handOverImage4 = imghd4;
            Chats.push({
              id: Chats.length,
              image: imghd4,
              fromUser: true,
              sendId: data.vendorId,
              text: "Proof of Work",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format("LLL"),
              name: data?.name,
            });
          }
           if (arr[i].fieldname == "requestProof") {
            let imgrq=await uploadFile2(arr[i],"chat")
            Chats.push({
              id: Chats.length,
              image: imgrq,
              fromUser: true,
              sendId: data.vendorId,
              text: "Request of proof",
              recivedId: data.userId,
              jobId: data?._id,
              data: moment().format("LLL"),
              name: data?.name,
            });
          }
          data.handOver = true;
        }
      }
      data.VendorStatus = "Complete";
      data.status = "Complete";
 data.chat=Chats;
      await data.save();

      await NotificationsModel.create({
        title: "HandOver Images",
        userid: data?.vendorId,
        Amount: "",
        comment: `HandOver Images by${data?.vendorName} and Customer ${data?.userName} and user-address ${data?.userAddress}`,
      });

      return res.status(200).json({ success: "Successfully uploaded" });
    } catch (error) {
      console.log(error);
    }
  }

  async pouseJobsReason(req, res) {
    try {
      let { id, vendorAdvanceAm, reason, scheduleDate, scheduleTime } =
        req.body;
      let cheak = await jobsModel.findById(id);
      if (!cheak) return res.status(400).json({ error: "Data not found" });
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            scheduleDate,
            scheduleTime,
            serviceDate:scheduleDate,serviceTime:scheduleTime,
            vendorAdvanceAm,
            TotalAmount: Number(cheak.TotalAmount) - Number(vendorAdvanceAm),
            reason,
            status: "Pause",
            VendorStatus: "Pause",
          },
        }
      );

      await NotificationsModel.create({
        title: "Job Pause ",
        userid: data?.vendorId,
        Amount: vendorAdvanceAm,
        comment: `₹ Advance Take Amount  and reason  ${reason} schedule ${moment(
          data?.scheduleDate
        ).format("YYYY-MM-DD")} ${data?.userName} and user-address ${
          data?.userAddress
        }`,
      });
      return res.status(200).json({ success: "Successfully uploaded" });
    } catch (error) {
      console.log(error);
    }
  }
  async notworkingreason(req, res) {
    try {
      let { id, notworkingReason } = req.body;
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            notworkingReason,
            status: "Not Working",
            VendorStatus: "Cancel",
          },
        }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      await NotificationsModel.create({
        title: "Not Working ",
        userid: data?.vendorId,
        Amount: "",
        comment: `₹ Advance Take Amount  by${data?.vendorName} and reason  ${notworkingReason} schedule  ${data?.userName} and user-address ${data?.userAddress}`,
      });

      return res.status(200).json({ success: "Successfully uploaded" });
    } catch (error) {
      console.log(error);
    }
  }
  async makecheckOutJobs(req, res) {
    try {
      let { id, payAmount, paymentStatus, payId, paymentMethod } = req.body;
      let check = await jobsModel.findById(id);
      if (!check) return res.status(400).json({ error: "Data not found" });
      let data = await jobsModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            payAmount: check.payAmount + Number(payAmount),
            paymentStatus,
            payId,
            paymentMethod,
          },
        }
      );

      return res.status(200).json({ success: "SuccessFully payment" });
    } catch (error) {
      console.log(error);
    }
  }
  async getuserById(req, res) {
    try {
      let user = req.params.id;
      let data = await jobsModel
        .find({ userId: user })
        .sort({ _id: -1 })
        .populate({ path: "serviceType.serviceId" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async assignnewjobArea(req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        console.log("Invalid or missing job ID in request:", id);
        return res.status(400).json({ error: "Missing or invalid job ID" });
      }
      const job = await jobsModel.findOne({ _id: id });
      if (!job) {
        return res.status(400).json({ error: "Job not found" });
      }

      // Find vendors within 10 km
      const vendors = await vendorModel.find({
        location: {
          $near: {
            $geometry: job?.location,
            $maxDistance: 10000, // 10 km in meters
          },
        },
      });
      if (vendors.length === 0) {
        return res.status(404).json({ error: "No vendors found within 10 km" });
      }

      // Loop through vendors and assign the job to each one with a 45-minute timeout
      for (const vendor of vendors) {
        await jobsModel.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              vendorId: vendor._id,
              VendorStatus: "Assigned",
              assignmentTime: new Date(),
            },
          }
        );

        // Set a timeout for 45 minutes
        setTimeout(async () => {
          // Find the job again to ensure it hasn't been completed
          const updatedJob = await jobsModel.findById(id);

          if (updatedJob && updatedJob.VendorStatus !== "Accepted") {
            // Reassign the job to the next vendor in the loop
            updatedJob.assignedTo = null;
            job.vendorId = updatedJob._id;
            job.VendorStatus == "Assigned";
            // Unassign the job from the current vendor
            await updatedJob.save();
          }
        }, 45 * 60 * 1000); // 45 minutes in milliseconds
      }

      return res.json({ message: "Job assigned to vendors within 10 km" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getJobsByVendorIdLastDay(req, res) {
    try {
      let vendorId = req.params.id;
      let data = await jobsModel
        .find({ "JobAssignedVendor.vendorId": vendorId })
        .sort({ _id: -1 })
        .limit(20);
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getAlertJobsByVendor(req, res) {
    try {
      let id = req.params.id;

      let data = await jobsModel.find({
        vendorId: id,
        $or: [{ VendorStatus: "Assigned" }, { VendorStatus: "Flash" }],
      });
      if (data.length == 0)
        return res.status(400).json({ error: "No job assined you" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async jobWarranty(req, res) {
    const { id, warrantyMonths } = req.body;
    const job = await jobsModel.findOne({ _id: id });

    if (!id || !warrantyMonths) {
      res
        .status(400)
        .json({ error: "Service and warrantyMonths are required" });
    } else {
      const newService = {
        id: services.length + 1,
        warrantyMonths,
      };
      services.push(newService);
      res.status(201).json(newService);
    }
  }

  async revisitJob(req, res) {
    try {
      const {
        id,
        revijitAmount,
        pincode,
        userAddress,
        houseno,
        landmark,
        longitude,
        latitude,
        serviceTime,
        serviceDate,
      } = req.body;
      const job = await jobsModel.findOne({ _id: id });
      if (!job) return res.status(400).json({ error: "Data not Found" });
      if (revijitAmount) {
        job.revijitAmount = revijitAmount;
      }

      job.revijitCount = job.revijitCount + 1;
      job.revisitStatus = "Assigned";
      job.pincode = pincode;
      job.userAddress = userAddress;
      job.landmark = landmark;
      job.houseno = houseno;
      job.location = { type: "Point", coordinates: [longitude, latitude] };
      job.serviceDate = serviceDate;
      job.serviceTime = serviceTime;
      const job2 = await job.save();
      if (job.revijitCount < 2) {
        job2.VendorStatus = "Assigned";
        await job2.save();
        emitEvent(`AutoAssignedJob`, job2.vendorId);
      }

      return res
        .status(200)
        .json({ success: "Revisit record added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addRating(req, res) {
    try {
      const { vendorId, userId, rate, userName, comment } = req.body;

      if (rate < 1 || rate > 5) {
        return res
          .status(400)
          .json({ error: "Rating should be between 1 and 5" });
      }

      // Find the vendor by vendorId
      const vendor = await jobsModel.findOne({ _id: vendorId });

      if (!vendor) {
        return res.status(400).json({ error: "Vendor not found" });
      }

      if (comment) {
        vendor.comment = comment;
      }
      vendor.rate = rate;

      await vendor.save();

      return res.status(200).json({
        success: "Thank you for your rating",
      });
    } catch (error) {
      // Handle errors here
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getAllAssignedJobCaleceForVendor(req, res) {
    try {
      let vendorId = req.params.id;
      let data = await jobsModel
        .find({ "JobAssignedVendor.vendorId": vendorId })
        .sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
 
 async makeCancelJobByUser(req,res){
     try{
         let {id,reason,refouned}=req.body;
         let data=await jobsModel.findOneAndUpdate({_id:id},{$set:{VendorStatus:"Cancel",status:"Cancel",refouned:refouned}});
         if(!data) return res.status(400).json({error:"Data not found"});
         return res.status(200).json({success:"Successfully canceled"})
         
     }catch(error){
         console.log(error)
     }
 }
 
 async updatecomission(req, res) {
    try {
      let { id, commissionId, recivedammount, statuscheck } = req.body;
      console.log(id, commissionId, recivedammount, statuscheck,"id, commissionId, recivedammount, statuscheck>>>")
      let obj = {};
      if (commissionId) {
        obj["commissionId"] = commissionId;
      }
      if (recivedammount) {
        obj["recivedammount"] = recivedammount;
      }
      if (statuscheck) {
        obj["statuscheck"] = statuscheck;
      }
      let data = await jobsModel.findByIdAndUpdate(
        id,
        { $set: obj },
        { new: true }
      );
      return res.status(200).json({
        success: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  }

 
}
module.exports = new Jobs();
