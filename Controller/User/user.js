const userModal = require("../../Modal/User/user");
const { validateEmail, toTitleCase } = require("../../Config/function");
const otpModel = require("../../Modal/User/otpModel");
const bcrypt = require("bcryptjs");
const axios = require("axios");
class Auth {
  async signup(req, res) {
    let {
      name,
      email,
      phone,
      //   password,
      //   confirmpassword,
      //   houseno,
      //   landmark,
      //   addressVal,
    } = req.body;
    try {
      if (
        !name ||
        !email ||
        !phone
        // ||
        // !password ||
        // !confirmpassword 

      ) {
        return res.status(400).json({ error: "All field must not be empty" });
      }
      if (name.length < 3 && name.length > 25) {
        return res.status(400).json({ error: "Name must be 3-25 charecter" });
      }
      //   if (password.length < 8) {
      //     return res
      //       .status(400)
      //       .json({ error: "password should be more than 8" });
      //   }
      //   if (password !== confirmpassword) {
      //     return res.status(400).json({ error: "password not match" });
      //   }
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Email is not valid" });
      }

      //   password = await bcrypt.hash(password, 10);
      //   confirmpassword = await bcrypt.hash(confirmpassword, 10);
      name = toTitleCase(name);

      const Email = await userModal.findOne({ email: email });
      console.log(Email);
      if (Email) {
        return res.status(400).json({ error: "Email already exits" });
      }
      const mobile = await userModal.findOne({ phone: phone });
      if (mobile) {
        return res.status(400).json({ error: "mobile number already exits" });
      }

      let Newuser = new userModal({
        name,
        email,
        phone,
        // password,
        // confirmpassword,

        // houseno,
        // landmark,
        // userAddresses: [
        //   {
        //     address: addressVal,
        //   },
        // ],
      });
      Newuser.save().then((data) => {
        console.log(data);
        return res
          .status(200)
          .json({ success: "true", message: "Signup Success, Please login" });
      });
    } catch (error) {
      console.log("error");
      return res.status(500).json({
        msg: false,
        error: "Errro in Registeration",
      });
    }
  }

  async signinwithphone(req, res) {
    const { phone } = req.body;
    try {

      const isPhonePresent = await userModal.findOne({ phone: phone });
      if (!isPhonePresent) {
        return res
          .status(400)
          .json({ error: "Phone number is not registered..." });
      }

      if (isPhonePresent.isBlock == true) {
        return res.status(400).json({ error: "Blocked by Admin. Please contact!!!" });
      }

      let otp = (Math.floor(Math.random() * 1000000) + 1000000)
        .toString()
        .substring(1);

      // Checking that the phone is already present in the DB or not.

      const phoneNoPresent = await otpModel.findOne({ phone: phone });

      const key = "Ae97f7ad9d6c2647071d78b6e94a3c87e";
      const sid = "RDABST";
      const to = phone;
      const body = `Hi, Your OTP for mobile verification is ${otp} Regards, Team ReadAbstract`;
      //   axios
      //     .get(
      //       "https://api-alerts.kaleyra.com/v4/?api_key=" +
      //         key +
      //         "&method=sms&message=" +
      //         body +
      //         "&to=" +
      //         to +
      //         "&sender=RDABST"
      //     )
      //     .then(async (data) => {
      //       console.log(`statusCode: ${data.status}`);
      //       console.log(data);
      if (!phoneNoPresent) {
        let newotp = new otpModel({
          phone,
          otp: 123456,
        });
        newotp
          .save()
          .then((data) => {
            return res.status(200).json({
              success: `OTP sent: ${data.otp}`,
              details: isPhonePresent,
            });
          })
          .catch((error) => {
            return res.status(400).json({ error: error });
          });
      } else {
        await otpModel.findOneAndUpdate(
          { phone: phone },
          { $set: { otp: 123456 } },
          { new: true }
        );
        return res.status(200).json({
          success: "OTP send successfully",
          details: isPhonePresent,
        });
      }
      // })
      // .catch((error) => {
      //   console.error(error);
      //   return res.status(500).json({ error: error });
      // });
    } catch (error) {
      console.log(error);
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
    let { userId, name, email, phone, password } = req.body;

    let obj = {};
    if (name) {
      obj["name"] = name;
    }
    if (email) {
      obj["email"] = email;
    }
    if (phone) {
      obj["phone"] = phone;
    }
    if (password) {
      obj["password"] = await bcrypt.hash(password, 10);
    }

    let user = await userModal.findByIdAndUpdate(
      userId,
      { $set: obj },
      { new: true }
    );

    if (user) {
      return res
        .status(200)
        .json({ success: "Updated successfully", user: user });
    }
    return res.status(500).json({ error: "something went wrong" });
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
