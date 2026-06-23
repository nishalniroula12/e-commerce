import Cart from "../models/cart.js";
import Product from "../models/product.js";
export const addcart = async (req, res) => {
  try {
    const { product } = req.body;
    const userid = req.user._id;
    console.log(userid)

    const prod = await Product.findById(product);

    if (!prod) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (prod.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Product not available"
      });
    }

    let cart = await Cart.findOne({ user: userid });
     console.log(cart)
    if (!cart) {
      cart = await Cart.create({
        user: userid,
        itemL: []
      });
    }

    const existing = cart.itemL.find(
      (item) => item.product.toString() === product
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already in cart"
      });
    }

    cart.itemL.push({
      product: prod._id,
      name: prod.title,
      price: prod.price,
      image: prod.image,
      quantity: 1
    });

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getcart =async(req,res)=>{
try {
  const userid =req.user._id
  console.log(userid)

  const cart =await Cart.findOne({user :userid}).populate("itemL.product")

  if(!cart){
    return res.json({
      success:true,
      itemL:[],
      totalamount:0,
      totalitem:0,
      
    })
  }
  return res.status(200).json({
    success:true,
    message:"find the cart",
    cart
  })
  
} catch (error) {
  console.log(error)
  
}
}
export const updatecart = async (req, res) => {
  try {
    const { productid, quantity,name } = req.body;

    const user = req.user._id;

    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // FIX: use itemL correctly
    const item = cart.itemL.find(
      (item) => item.product.toString() === productid
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;
    item.name = name

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productid } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.itemL = cart.itemL.filter(
      (item) => item.product.toString() !== productid
    );

    cart.totalitems = cart.itemL.reduce(
      (sum, i) => sum + i.quantity,
      0
    );

    cart.totalamount = cart.itemL.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

