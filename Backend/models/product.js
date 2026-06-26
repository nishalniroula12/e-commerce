import mongoose from "mongoose";

const productmodel =new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    discounted:{
        type:Number,
        default:0

    },
    stock:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    code:{
        type:String,
        required:true

    },
    public_id:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },



    

},{timestamps:true})

const Product =mongoose.model("Product" ,productmodel)
export default Product
