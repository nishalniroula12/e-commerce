import mongoose, { trusted } from "mongoose";

const sellermodel =new mongoose.Schema({
    shopname:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
        unique:true

    },
    description:{
        type:String,
        required:true
    },
    shoplogo:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:0
    },
    taxnumber:{
        type:String
    },
    verificationstatus:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"

    },
    verificationdate:{
        type:Date,
    },
    bankdetails:{
        accountname:String,
        accountnumber:String,
        bankname:String
    },
    totalsales:{
        type:Number,
        default:0


    },
    address:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    }


},{timestamps:true})

const Seller =mongoose.model("Seller",sellermodel)
export default Seller