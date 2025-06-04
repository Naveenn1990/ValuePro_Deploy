const adminModel = require("../../Modal/Admin/Admin1");
// const nodemailer = require("nodemailer");

class Admin {
  async AdminSignup(req, res) {
       try {
    let { name, contactnum, email, password } = req.body;
      let Newuser = new adminModel({
        name,
        email,
        password,
        contactnum,
      });
      Newuser.save().then((data) => {
        console.log(data);
        return res.status(200).json({ success: "success" });
      });
    } catch (error) {
      console.log(error);
    }
  }

 async Postadminlogin(req, res) {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all fields" });
        } else {
            const admin = await adminModel.findOne({ email });

            if (!admin) {
                return res.status(401).json({ error: "Invalid email" });
            }

            // Check if the password matches (You should use a secure method like bcrypt for this)
            if (admin.password !== password) {
                return res.status(401).json({ error: "Invalid password" });
            }

            return res.status(200).json({ success: "Login success", admin });
        }
    } catch (error) {
        console.error("An error occurred during admin login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


  async adminSignout(req, res) {
    let signout = req.params.adminid;
    try {
      await adminModel
        .findOneAndUpdate({ _id: signout }, { status: "Offline" })
        .then((data) => {
          return res.json({ Success: "Signout Successfully" });
        })
        .catch((err) => {
          return res.status({ error: "Something went wrong" });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async addsubadmin(req, res) {
     try { 
      let {
      name,
      email,
      password,
      contactnum,
      User,
      product,
      Vendor,
      banner,
      category,
      Jobs,
      service,
      referral,
      offer,
      payments,
      expanseType,
      subAdmin,
      Leaves,
      Attendance,
      Expense,
      CreditDebit,
      ProfitLoss,
    } = req.body;
    let error = {};
    if (!name || !email || !password || !contactnum) {
      error = {
        ...error,
        name: "Filed must not be empty",
        email: "Filed must not be empty",
        password: "Filed must not be empty",
        phoneNumber: "Filed must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      return res.json({ error: "Name must be 3-25 charecter" });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          return res
            .status(403)
            .json({ error: "Password must be 8 charecter" });
        } else {
            const data = await adminModel.findOne({ email: email });
            const data1 = await adminModel.findOne({ contactnum: contactnum });
            if (data) {
              return res.status(403).json({
                error: "Email already exists, Please try with other Email ID",
              });
            } else if (data1) {
              return res.status(403).json({
                error:
                  "Contact number already exists, Please try with other Number",
              });
            } else {
              let newUser = new adminModel({
                role: 1,
                name,
                email,
                password,
                contactnum,
                User,
                product,
                Vendor,
                banner,
                category,
                Jobs,
                service,
                referral,
                offer,
                payments,
                expanseType,
                subAdmin,
                Leaves,
                Attendance,
                Expense,
                CreditDebit,
                ProfitLoss,
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success: "Account create successfully. Please login",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
        
        }
      } else {
        error = {
          ...error,
          password: "",
          name: "",
          email: "Email is not valid",
        };
        return res.status(403).json({ error });
      }
    } 
   } catch (err) {
            console.log(err);
          }
  }

  async postdeletesubadmin(req, res) {
    let id = req.params.id;
    const data = await adminModel.deleteOne({ _id: id });

    return res.json({ success: "Successfully" });
  }

  async getallsubadmin(req, res) {
    let subadmin = await adminModel.find({ role: 1 });
    if (subadmin) {
      return res.json({ subadmin: subadmin });
    } else {
      return res.status(403).json({ error: "No subadmin exist" });
    }
  }

  async editsubadmin(req, res) {
    try {
        let { id, name, email, contactnum, password } = req.body;
    let subadmin = await adminModel.findOneAndUpdate(
      { _id: id },
      {
        name: name,
        email: email,
        password: password,
        contactnum: contactnum,
      }
    );
    if (subadmin) {
      return res.status(200).json({ success: "Details Updated Successfully" });
    } else {
      return res.status(403).json({ error: "Error" });
    }
    } catch (error) {
      console.log(error);
    }
  
  }

  async editsubadminaccess(req, res) {
    try {
  let {
      id,
      User,
      offer,
      payments,
      product,
      banner,
      expanseType,
      subAdmin,
      Vendor,
      category,
      Jobs,
      service,
      referral,
      Leaves,
      Attendance,
      Expense,
      CreditDebit,
      ProfitLoss,
    } = req.body;
    let subadmin = await adminModel.findOneAndUpdate(
      { _id: id },
      {
        User: User,
        offer: offer,
        payments: payments,
        product: product,
        banner: banner,
        expanseType: expanseType,
        subAdmin: subAdmin,
        Vendor: Vendor,
        category: category,
        Jobs: Jobs,
        service: service,
        referral: referral,
        Leaves: Leaves,
        Attendance: Attendance,
        Expense: Expense,
        CreditDebit: CreditDebit,
        ProfitLoss: ProfitLoss,
      }
    );
    if (subadmin) {
      return res.status(200).json({ success: "Details Updated Successfully" });
    } else {
      return res.status(403).json({ error: "Error" });
    }
    } catch (error) {
      console.log(error);
    } }
    
    // forget
// async sendMail(req, res) {
//   try {
//     let { email } = req.body;
//     console.log("Ckeck email",email)
//     const isUserPresent = await adminModel.findOne({ email: email });
//     if (!isUserPresent) {
//       return res
//         .status(400)
//         .json({ error: "Please Enter Registered Email Id..." });
//     }
//     // Create a transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // Replace with your email service provider
//       auth: {
//         user: "amitparnets@gmail.com", // Replace with your email
//         pass: "yzbzpllsthbvrdal", // Replace with your password or app-specific password
//       },
//       port: 465,
//       host: "gsmtp.gmail.com",
//     });

//     // Generate a random OTP
//     const otp = randomstring.generate({
//       length: 6,
//       charset: "numeric",
//     });

//     // Save the OTP to the user document in MongoDB
//     isUserPresent.otp = otp;

//     // Set a timer to clear the OTP after the expiration time
//     setTimeout(() => {
//       isUserPresent.otp = null; // Clear the OTP
//       isUserPresent.save(); // Save the user document with the cleared OTP
//     }, 60 * 1000); // Convert OTP_EXPIRATION_TIME to milliseconds

//     await isUserPresent.save();

//     // Email configuration
//     const mailOptions = {
//       from: "amitparnets@gmail.com",
//       to: Email,
//       subject: "OTP Verification",
//       text: `Your OTP is: ${otp}`,
//     };

//     // Send the OTP via email
//     const info = await transporter.sendMail(mailOptions);

//     console.log("OTP sent:", info.response);
//     res.json({ success: "OTP sent successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: "Failed to send OTP" });
//   }
// }

// async Otpverification(req, res) {
//   try {
//     let { otp, email } = req.body;

//     const user = await adminModel.findOne({ email: email });
//     if (user.otp == otp) {
//       return res.status(200).json({ success: " OTP verified successfully" });
//     } else {
//       // OTPs do not match
//       return res.status(400).json({ error: "Invalid OTP" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// async NewPassword(req, res) {
//   try {
//     const { Password, email } = req.body;
//     // Check if the email exists in the database
//     const user = await adminModel.findOne({ Email: Email });

//     if (user) {
//       // Hash the new password if provided
//     //   if (Password) {
//     //     const hashedPassword = await bcrypt.hash(Password, 10);
//     //     user.Password = hashedPassword; // Update the user's password
//     //   }

//       // Save the updated user document
//       const updatedUser = await user.save();

//       return res.status(200).json({
//         success: "Password updated successfully",
//         data: updatedUser,
//       });
//     } else {
//       return res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

   
}
const adminauthontroller = new Admin();
module.exports = adminauthontroller;
