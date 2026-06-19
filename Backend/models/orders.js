import mongoose from "mongoose";

const ordermodel =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"

    },
    totalamount:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["pending", "processing" ,"shipped","delevered" ,"cancelation"],
        default:"pending"
    },
    paymentmethod:{
        type:String,
        enum:["cash" ,"khalti","esewa" ,"card" ],
        default:"cash"

    }

},{timestamps:true})
 
const Order =mongoose.model("Order" ,ordermodel)
export default Order