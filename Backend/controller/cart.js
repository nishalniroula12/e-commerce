import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const addcart = async (req,res,next) => {
  try {
    const { user, product } = req.body;
    const userid = req.user._id;
    console.log(userid)
    const prod = await Product.findById(product);

    if (!prod) {
      return res.status(200).json({
        success: false,
        message: "Product not found",
        prod,
      });
    }
    if (prod.status !=="active") {
      return res.status(200).json({
        success: false,
        message: "Product not availble",
      });
    }
    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = new Cart({
        user,
        itemL: [],
        totalitems:0,
        totalamount:0
      });
    }
    const existingcart = cart.itemL.find(
      (item) => item.product.toString() === product
    );

    if (existingcart) {
      return res.status(200).json({
        success: false,
        message: "Product already in the cart",
      });
    } else {
      cart.itemL.push({
        product: prod._id,
        name: prod.title,
        price: prod.price,
        image: prod.image,
        seller: prod.seller,
        quantity:1
      });
    }
    await cart.save();

    res.status(200).json({
      success: true,
      message: "add to cart successfully ",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
