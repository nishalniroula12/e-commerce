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

    }
}
,{timestamps:true})

const User =mongoose.model("User" ,usermodel)
export default User