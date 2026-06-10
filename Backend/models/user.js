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
        enum:["buyer" ,"seller" ,"admin"],
        default:"buyer"

    }
}
,{timestamps:true})

const User =mongoose.model("User" ,usermodel)
export default User