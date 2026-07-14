import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../utlis/generate.js";
import {transporter} from "../config/nodemailer.js";
import Seller from "../models/seller.js";
// register
export const registerdata = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, role,shopname,
      description,
      address,
      taxnumber
    } = req.body;

    if (!username || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const otp =Math.floor(100000 + Math.random() * 900000).toString()

    const newuser = new User({
      username,
      email,
      password: hashpassword,
      verifyOtp:otp,
      expireVerifyOtp:Date.now() +10 *60*1000,
      role,
    });
    await newuser.save();
    await transporter.sendMail({
      from:process.env.SMTP_SENDER,
      to:email,
      subject:"try this otp",
      text:"how are you",
      html:`hello  ${otp} world`
    })
    res.json({
      success:true,
      message:"user created successfully"
    })
 
    await user.save();


    if(role ==="seller"){
    await Seller.create({
      user: user._id,
      shopname,
      description,
      address,
      taxnumber,
      shoplogo: "",
      public_id: ""
    })
    }
    const token =generatetoken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token
      }
    });
  
    res.status(200).json({
      success: true,
      message: " user create successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginone = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "All Field required",
      });
    }
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found",
      });



      
    }

    const matchpassword = await bcrypt.compare(password, user.password);

    console.log(matchpassword);
    if (!matchpassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
  
    if (user.role === "seller") {
      console.log(user);
      const sellers = await Seller.find();

      console.log("All sellers:");
      console.log(sellers);
      const seller = await Seller.findOne({ user: user });

      console.log("User ID:", user._id);
      console.log("Seller:", seller);
      if (!seller) {
        return res.status(201).json({
          success: false,
          message: "seller not found",
        });
      }
      if (seller.verificationstatus === "pending") {
        return res.status(400).json({
          success: true,
          message: "ready for the approve by admin",
        });
      }

      if (seller.verificationstatus === "rejected") {
        return res.status(401).json({
          success: true,
          message: "rejected by the admin",
        });
      }
    }
    const token = generatetoken({ id: user._id }, process.env.JWT_SECRET, "7d");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(token);
    res.status(200).json({
      success: true,
      message: "user login",
      users: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};
export const logoutla = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({
      message: "logout vayo la",
    });
  } catch (error) {
    console.log(error);
  }
};
export const verifyotped =async(req,res)=>{
  try {
    const {email ,otp} =req.body
    const user =await User.findOne({email})
    if(!user){
      return res.status(400).json({
        success:false,
        message:"user not found"
      })
    }
    if(Date.now() >user.expireVerifyOtp){
      return res.status(400).json({
        success:false,
        message:"opt expired"
      })
    }
    if(user .verifyOtp !==otp){
      return res.status(400).json({
        success:false,
        message:"Invalid otp"
      })
    }
    user.isVerify=true,
    user.verifyOtp=null,
    user.expireVerifyOtp=null,

    await user.save()
    return res.status(200).json({
      success:true,
      message:"Email  verified successfully"
    })

    
  } catch (error) {
    console.log(error)
    
  }
}
export const forgetpass =async(req,res)=>{
  try {
    const {email} =req.body
    const user =await User.findOne({email})
    if(!user){
    return res.status(401).json({
      success:false,
      message:"user not found"
    })  
  }

  const otp =Math.floor(100000 + Math.random() * 900000).toString()
  user.otp = otp,
  user.otpExpire=Date.now() + 10 *60 *1000

  await user.save()

  await transporter.sendMail({
    from: process.env.SMPT_USER,
    to:user.email,
    subject:"Reset password",
    html: `
        <p>Your reset token is:</p>
        <h2>${otp}</h2>
        <p>This token expires in 10 minutes.</p>
      `,
    });

   res.status(200).json({
    success:true,
    message:"password link sent"
  })
}


   catch (error) {
    console.log(error)
    
  }

}

export const resetpassword = async (req, res) => {
  try {
    console.log(req.body);

    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    const user = await User.findOne({
      otp: token,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};