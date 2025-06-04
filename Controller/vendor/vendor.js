const vendorModel = require("../../Modal/venor/vendor");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const walletModel = require("../../Modal/venor/wallet");
const { validateEmail, toTitleCase } = require("../../Config/function");
const { uploadFile2 } = require("../../Config/AWS");
class Vendor {
  async registerVendor(req, res) {
    try {
      let {
        name,
        email,
        mobile,
        toRefNum,
        addhar,
        pancard,
        gst,
        area,
        city,
        state,
        piccode,
        password,
        confirmPassword,
      } = req.body;

      if (!name)
        return res.status(405).json({ error: "Please enter your name" });

      name = toTitleCase(name);
      if (!mobile)
        return res
          .status(406)
          .json({ error: "Please enter your mobile number" });

      let check = await vendorModel.findOne({ mobile: mobile });
      if (check)
        return res
          .status(407)
          .json({ error: `${mobile} number already register` });
      if (!email)
        return res.status(408).json({ error: "Please enter your email" });
      if (!validateEmail(email)) {
        return res.status(409).json({ error: "Email is not valid" });
      }

      let check2 = await vendorModel.findOne({ email: email });
      if (check2)
        return res.status(410).json({ error: `${email} id already register` });
      let checkRef;
      if (toRefNum) {
        checkRef = await vendorModel.findOne({ RefNum: toRefNum });
        if (!checkRef)
          return res.status(411).json({ error: "Referral number not valid" });
      }
      if (!password)
        return res.status(412).json({ error: "Please enter your password" });
      password = await bcrypt.hash(password, 10);

      let obj = {};
      if (name) {
        obj["name"] = name;
      }
      if (email) {
        obj["email"] = email;
      }
      if (mobile) {
        obj["mobile"] = mobile;
      }
      if (toRefNum) {
        obj["toRefNum"] = toRefNum;
      }
      if (addhar) {
        obj["addhar"] = addhar;
      }
      if (pancard) {
        obj["pancard"] = pancard;
      }
      if (gst) {
        obj["gst"] = gst;
      }
      if (area) {
        obj["area"] = area;
      }
      if (city) {
        obj["city"] = city;
      }
      if (state) {
        obj["state"] = state;
      }
      if (piccode) {
        obj["piccode"] = piccode;
      }
      if (gst) {
        obj["gst"] = gst;
      }
      if (password) {
        obj["password"] = password;
      }
      if (confirmPassword) {
        obj["confirmPassword"] = confirmPassword;
      }
    //   req.files.length != 0
      if (req.files && req.files.length > 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "residential") {
            obj["residential"] = await uploadFile2(arr[i],"vendor");
          }
          if (arr[i].fieldname == "police") {
            obj["police"] = await uploadFile2(arr[i],"vendor");
          }
        }
      }
      let data = await vendorModel.create(obj);
      if (!data) return res.status(500).json({ error: "Something went wrong" });
      let transaction;
      let amount = 0;
      if (toRefNum) {
        amount = 100;
        transaction = [
          {
            title: "Get referral  revored ",
            amount: 100,
            status: "CR",
          },
        ];
        let ab = await walletModel.findOneAndUpdate(
          { vendorId: checkRef._id },
          {
            $push: {
              transaction: {
                title: `Get referral  revored from ${mobile}`,
                amount: 100,
                status: "CR",
              },
            },
          }
        );
        await walletModel.findOneAndUpdate(
          { vendorId: checkRef._id },
          { $set: { totalAmount: ab.totalAmount + 100 } }
        );
      }
      await walletModel.create({
        vendorName: name,
        mobile: mobile,
        vendorId: data._id,
        totalAmount: amount,
        transaction: transaction,
      });
      return res.status(200).json({ success: "Successfully registered" });
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateVender(req, res) {
    try {
      let {
        id,
        name,
        mobile,
        email,
        password,
        addhar,
        pancard,
        gst,
        area,
        city,
        state,
        piccode,
        residential,
        police,
      } = req.body;
      let obj = {};
      if (name) {
        obj["name"] = name;
      }
      if (mobile) {
        let check = await vendorModel.findOne({ mobile: mobile });
        if (check)
          return res
            .status(400)
            .json({ error: `${mobile} number already register` });
        obj["mobile"] = mobile;
      }
      if (email) {
        let check2 = await vendorModel.findOne({ email: email });
        if (check2)
          return res
            .status(400)
            .json({ error: `${email} id already register` });
        obj["email"] = email;
      }
      if (password) {
        password = await bcrypt.hash(password, 10);
        obj["password"] = password;
      }
      if (addhar) {
        obj["addhar"] = addhar;
      }
      if (pancard) {
        obj["pancard"] = pancard;
      }
      if (gst) {
        obj["gst"] = gst;
      }
      if (area) {
        obj["area"] = area;
      }
      if (city) {
        obj["city"] = city;
      }
      if (state) {
        obj["state"] = state;
      }
      if (piccode) {
        obj["piccode"] = piccode;
      }
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr?.length; i++) {
          if (arr[i].fieldname == "residential") {
            obj["residential"] = await uploadFile2(arr[i],"vendor");
          }
          if (arr[i].fieldname == "police") {
            obj["police"] = await uploadFile2(arr[i],"vendor");
          }
          if (arr[i].fieldname == "adharDocBack") {
            obj["adharDocBack"] = await uploadFile2(arr[i],"vendor");
          }
          if (arr[i].fieldname == "panDoc") {
            obj["panDoc"] = await uploadFile2(arr[i],"vendor");
          }
          if (arr[i].fieldname == "gstDoc") {
            obj["gstDoc"] = await uploadFile2(arr[i],"vendor");
          }
          obj["status"] = "Pending";
        }
      }
      console.log("checkdata>>>",residential,police)
      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Something went wrong" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async vendorLogin(req, res) {
    try {
      let { email, password } = req.body;
      console.log(email);
      if (!email)
        return res.status(400).json({ error: "Please enter your email" });
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Email is not valid" });
      }
      if (!password)
        return res.status(400).json({ error: "Please enter your password" });
      let check2 = await vendorModel.findOne({ email: email });
      if (!check2)
        return res
          .status(400)
          .json({ error: "Please enter register email id" });
      let compare = await bcrypt
        .compare(password, check2.password)
        .then((res) => {
          return res;
        });

      if (!compare) {
        return res.status(400).send({ error: "Incorrect password" });
      }
      if (check2.isBlock == true)
        return res
          .status(400)
          .json({ error: "Your acount is blocked please contact to admin" });
      let data = await vendorModel.findOneAndUpdate(
        { _id: check2._id },
        { $set: { Active: "Online" } },
        { new: true }
      );
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
  async makeBlockUnblockVendor(req, res) {
    try {
      let { id, isBlock } = req.body;
      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        { $set: { isBlock: isBlock } },
        { new: true }
      );

      if (!data) return res.status(400).json({ error: "Data not found" });
      if (data?.isBlock == true)
        return res.status(200).json({ success: "Successfully blocked" });
      return res.status(200).json({ success: "Successfully Un-blocked" });
    } catch (error) {
      console.log(error);
    }
  }

  async makeApproveAndHoldVendor(req, res) {
    try {
      let { id, status } = req.body;
      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } },
        { new: true }
      );

      if (!data) return res.status(400).json({ error: "Data not found" });
      if (data?.status == "Approved")
        return res.status(200).json({ success: "Successfully Approved" });
      return res.status(200).json({ success: "Successfully Hold" });
    } catch (error) {
      console.log(error);
    }
  }
  async getAllVendors(req, res) {
    try {
      let data = await vendorModel.find().sort({ AvRating: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getVendorById(req, res) {
    try {
      let id = req.params.id;
      let data = await vendorModel.findById(id);
      if (!data) return res.status(400).json({ error: "data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async addRating(req, res) {
    try {
      let { vendorId, userId, rate, userName, comment, jobId } = req.body;

      if (rate < 1 || rate > 5)
        return res
          .status(400)
          .json({ error: "Rating should be between 1 and 5" });

      let data = await vendorModel.findOne({ _id: vendorId });
      if (!data)
        return res.status(400).json({ error: "Something went wrong!" });

      let rating = data.rating;

      let am = rating.find((ele) => ele?.jobId?.toString() === jobId);

      if (!am) {
        rating.push({ userId, userName, rate: Number(rate), comment, jobId });
      } else {
        let index = rating.findIndex((ele) => ele?.jobId?.toString() === jobId);
        rating[index] = {
          userId,
          userName,
          rate: Number(rate),
          comment,
          jobId,
        };
      }

      let AvRating =
        rating.reduce((a, item) => a + item.rate, 0) / rating.length;

      await vendorModel.findOneAndUpdate(
        { _id: vendorId },
        { $set: { AvRating, rating } }
      );

      return res.status(200).json({ success: "Thank you for rating" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async UpdateBankDetailsVendor(req, res) {
    try {
      let { id, BankName, AcNo, ifceCode, ACHoldName, Branch } = req.body;
      let obj = {};
      if (BankName) {
        obj["BankName"] = BankName;
      }
       if (AcNo) {
        obj["AcNo"] = AcNo;
      } if (ifceCode) {
        obj["ifceCode"] = ifceCode;
      }
      if (ACHoldName) {
        obj["ACHoldName"] = ACHoldName;
      }
      if (Branch) {
        obj["Branch"] = Branch;
      }
      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        {new : true}
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res
        .status(200)
        .json({ success: "Successfully updated bank details" });
    } catch (error) {
      console.log(error);
    }
  }
  async UpdateCommisionVendor(req, res) {
    try {
      let { id, commision } = req.body;
      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        { $set: { commision: commision } }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }

  async updateLocationVendor(req, res) {
    try {
      const { id, latitude, longitude } = req.body;

      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            location: { type: "Point", coordinates: [longitude, latitude] },
          },
        },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async makeAssignedHubVendor(req, res) {
    try {
      let { id, assignmentHubPincode, Hub } = req.body;
      let data = await vendorModel.findOneAndUpdate(
        { _id: id },
        { $set: { assignmentHubPincode, Hub } }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully Assigned" });
    } catch (error) {
      console.log(error);
    }
  }

  async updatevendortoken(req,res){
    try {
      let { id, token } = req.body;
      let data = await vendorModel.findOneAndUpdate({ _id: id }, { $set: {fcmtoken:token}});
      if (!data) return res.status(400).json({ error: "Data not found"})
        return res.status(200).json({ success: "Token updated successfully" })
    }catch(err){
      console.log(err)
    }
  }

  async MarkTimeOnOfVendor(req, res) {
    try {
      let { id, date, time } = req.body;
      let data = await vendorModel.findById(id);
      if (!data) return res.status(400).json({ error: "Data not found" });
      // Check if the date already exists in TimeOn array
      const existingIndex = data.TimeOn.findIndex((item) => item.date === date&&item.time===time);

      if (existingIndex !== -1) {
        data.TimeOn.splice(existingIndex, 1);
      } else {
        data.TimeOn.push({ date, time });
      }

    data=  await data.save();

      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new Vendor();
