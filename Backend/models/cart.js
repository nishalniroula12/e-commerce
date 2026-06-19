import mongoose from "mongoose";

const cartitemschema =new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    quantity:{
        type:Number,
        default:1,
        min:1

    },
    price:{
        type:Number,
        required:true
    }
})
const cartSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    itemL:[cartitemschema],
    totalamount:{
        type:Number,
        default:0
    },
    totalitems:{
        type:Number,
        default:0
    }
},{timestamps:true})

cartSchema.pre("save", function(next) {
    this.totalitems = this.itemL.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  
    this.totalamount = this.itemL.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    next();
  });
  

const Cart =mongoose.model("Cart" ,cartSchema)
export default Cart