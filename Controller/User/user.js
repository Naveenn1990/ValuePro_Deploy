const userModal = require("../../Modal/User/user");
const { validateEmail, toTitleCase } = require("../../Config/function");
const otpModel = require("../../Modal/User/otpModel");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { sendOTP, generateOTP } = require("../../Utils/smsService");
class Auth {
  async signup(req, res) {
    let {
      name,
      email,
      phone,
    } = req.body;
    try {
      if (!name || !email || !phone) {
        return res.status(400).json({ error: "All field must not be empty" });
      }
      if (name.length < 3 && name.length > 25) {
        return res.status(400).json({ error: "Name must be 3-25 charecter" });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Email is not valid" });
      }

      name = toTitleCase(name);

      const Email = await userModal.findOne({ email: email });
      if (Email) {
        return res.status(400).json({ error: "Email already exits" });
      }
      const mobile = await userModal.findOne({ phone: phone });
      if (mobile) {
        return res.status(400).json({ error: "mobile number already exits" });
      }

      let Newuser = new userModal({ name, email, phone });
      Newuser.save().then((data) => {
        return res.status(200).json({ success: "true", message: "Signup Success, Please login" });
      });
    } catch (error) {
      console.log("error");
      return res.status(500).json({ msg: false, error: "Errro in Registeration" });
    }
  }

  // ── Send OTP before signup (verify phone is real) ─────────────
  async sendSignupOtp(req, res) {
    const { phone } = req.body;
    try {
      if (!phone || phone.length !== 10) {
        return res.status(400).json({ error: "Enter a valid 10-digit mobile number" });
      }

      // Check if already registered
      const existing = await userModal.findOne({ phone });
      if (existing) {
        return res.status(400).json({ error: "Mobile number already registered. Please login." });
      }

      const otp = generateOTP();

      // Save/update OTP in DB
      const existing_otp = await otpModel.findOne({ phone });
      if (!existing_otp) {
        await otpModel.create({ phone, otp });
      } else {
        await otpModel.findOneAndUpdate({ phone }, { $set: { otp } }, { new: true });
      }

      // Send real SMS
      const smsResult = await sendOTP(phone, otp, 'signup');
      if (!smsResult.success) {
        console.error('[sendSignupOtp] SMS failed:', smsResult.message);
        return res.status(500).json({ error: "Failed to send OTP. Please try again." });
      }

      return res.status(200).json({ success: "OTP sent to your mobile number" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  // ── Verify signup OTP then create account ─────────────────────
  async verifySignupOtp(req, res) {
    const { phone, otp, name, email } = req.body;
    try {
      if (!phone || !otp || !name || !email) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Verify OTP
      const otpRecord = await otpModel.findOne({ phone, otp });
      if (!otpRecord) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Email is not valid" });
      }

      // Double-check duplicates
      const emailExists = await userModal.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const phoneExists = await userModal.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ error: "Mobile number already registered" });
      }

      // Create user
      const newUser = await userModal.create({
        name: toTitleCase(name),
        email,
        phone,
      });

      // Clean up OTP
      await otpModel.deleteOne({ phone });

      return res.status(200).json({
        success: "Account created successfully",
        details: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async signinwithphone(req, res) {
    const { phone } = req.body;
    try {
      const isPhonePresent = await userModal.findOne({ phone: phone });
      if (!isPhonePresent) {
        return res.status(400).json({ error: "Phone number is not registered..." });
      }

      if (isPhonePresent.isBlock == true) {
        return res.status(400).json({ error: "Blocked by Admin. Please contact!!!" });
      }

      // Generate real 6-digit OTP
      const otp = generateOTP();

      // Save/update OTP in DB
      const phoneNoPresent = await otpModel.findOne({ phone: phone });
      if (!phoneNoPresent) {
        await otpModel.create({ phone, otp });
      } else {
        await otpModel.findOneAndUpdate(
          { phone: phone },
          { $set: { otp } },
          { new: true }
        );
      }

      // Send real SMS
      const smsResult = await sendOTP(phone, otp, 'login');

      if (!smsResult.success) {
        console.error('[signinwithphone] SMS failed:', smsResult.message);
        // Still allow login but log the failure — don't block user
      }

      return res.status(200).json({
        success: "OTP sent successfully",
        details: isPhonePresent,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  // OTP Varification

  async otpVarification(req, res) {
    const { phone, otp } = req.body;
    try {
      const varify = await otpModel.findOne({ phone: phone, otp: otp });
      const isPhonePresent = await userModal.findOne({ phone: phone });

      if (!varify) {
        return res.status(400).json({ error: "OTP is wrong" });
      }
      if (isPhonePresent.isBlock == true)
        return res
          .status(400)
          .json({ error: "Your account is blocked please contact admin" });
      return res
        .status(200)
        .json({ success: "OTP varified...", details: isPhonePresent });
    } catch (error) {
      console.log(error);
    }
  }
  // all user

  async alluser(req, res) {
    try {
      let allUser = await userModal.find({}).sort({ _id: -1 });
      return res.status(200).json({ success: allUser });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "false",
      });
    }
  }

  //   Edit user

  async edituser(req, res) {
    try {
      let { userId, name, email, phone, password } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      let obj = {};
      if (name) obj["name"] = name;
      if (email) obj["email"] = email;
      if (phone) obj["phone"] = phone;
      if (password) obj["password"] = await bcrypt.hash(password, 10);

      let user = await userModal.findByIdAndUpdate(
        userId,
        { $set: obj },
        { new: true }
      );

      if (user) {
        return res.status(200).json({ success: "Updated successfully", user });
      }
      return res.status(404).json({ error: "User not found" });
    } catch (error) {
      console.log("edituser error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async makeBlockUnblockUser(req, res) {
    try {
      let { id, isBlock } = req.body;
      let data = await userModal.findOneAndUpdate(
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


  async userDelete(req, res) {
    const id = req.params.id;
    try {
      const deleteuser = await userModal.findByIdAndDelete(id)
      return res.status(200).json({ success: deleteuser })

    } catch (error) {
      return res.status(400).json({
        message: "false",
      });
    }
  }

  async updatemobilefcmtoken(req, res) {
    try {
      const { id, token } = req.body
      // console.log(req.body)
      const data=await userModal.findById(id);
      if(data){
        data.mobilefcmtoken=token
        const result=await data.save()
      }
      return res.status(200).json({ success: "Updated successfully" })
    } catch (error) {
      console.log(error)
    }

  }

   async updatewebfcmtoken(req, res) {
    try {
      const { id, token } = req.body
      const data=await userModal.findById(id);
      if(data){
        data.webfcmtoken=token
        const result=await data.save()
      }
      return res.status(200).json({ success: "Updated successfully" })
    } catch (error) {
      console.log(error)
    }

  }
}

const authController = new Auth();
module.exports = authController;
