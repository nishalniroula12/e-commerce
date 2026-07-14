import mongoose from "mongoose";

const usermodel =new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,
        
    },
    role:{
        type:String,
        enum:["user" ,"seller" ,"admin"],
        default:"user"

    },

isVerify:{
    type:Boolean,
    default: false
},
verifyOtp:{
    type:String,
},
expireVerifyOtp:{
    type:Date
},
otp:{
    type:String,
},
otpExpire:{
    type:Date

}
}
,{timestamps:true})

const User =mongoose.model("User" ,usermodel)
export default User