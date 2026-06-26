import Order from "../models/orders.js";
import Product from "../models/product.js";

export const createorder =async(req,res)=>{
  try {
    const user =req.user._id;
    const {
      cart,
      paymentmethod,
      paymentstatus,
      shippingaddress,
      notes
    } =req.body
    if(!cart || !cart.itemL || !cart.itemL.length ===0){
      return res.status(200).json({
        Success:false,
        message:"Cart not found"
      })


    }
    let orderItems=[]
    for(const item of cart.itemL){
      const product =await Product.findById(item.product)

      if(!product){
        return res.status(200).json({
          Success:false,
          message:`Product not found:${item.Product}`
        })
      }
      orderItems.push({
        product:product._id,
        seller:product.seller,
        name:product.name,
        price:product.price,
        quantity:item.quantity,
        image:product.image,
      })
    }
    const order =await Order.create({
      user,
      items:orderItems,
      totalAmount: cart.totalamount,
      paymentmethod,
      paymentstatus,
      shippingaddress,
      notes,
      status: "confirmed",
    })
    return res.status(201).json({
        success:true,
        message:"data is create",
        order

    })

    
    
  } catch (error) {
    console.log(error)
    
  }
}