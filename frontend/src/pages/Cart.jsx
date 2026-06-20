import axios from "axios";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [data, setData] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/findcart",
        { withCredentials: true }
      );
  
      console.log("API CART:", res.data);
  
      // FIX: Check if res.data.cart exists first, otherwise fallback to res.data.itemL
      const items = res.data?.cart?.itemL || res.data?.itemL || [];
      setData(items);
    } catch (err) {
      console.log(err);
    }
  }; useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <h2>My Cart</h2>

      {data.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        data.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={item.product?.image}
              alt={item.product?.title}
              width="100"
            />

            <h4>{item.product?.title}</h4>
            <p>Price: Rs. {item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;