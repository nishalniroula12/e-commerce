import Order from "../models/orders.js"
export const orderone = async (req, res) => {
    try {
      const {
        user,
        status,
        product,
        address,
        totalamount,
        paymentmethod,
        seller,
      } = req.body;
  
      const order = await Order.create({
        user,
        product,
        address,
        totalamount,
        seller,
        status ,// use exact enum value
        paymentmethod
      });
  
      return res.status(200).json({
        success: true,
        message: "Order is created",
        order,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };