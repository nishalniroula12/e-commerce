import mongoose from "mongoose";

const categorymodel = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true

    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["active","inactive"
        ],
        default:"active"
        
    },
    sortorder:{
        type:Number,
        default:0
    },
    public_id:{
        type:String,
        required:true

    }

},{timestamps:true})
const Category =mongoose.model("Category",categorymodel)
export default Category