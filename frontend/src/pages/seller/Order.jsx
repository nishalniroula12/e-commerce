import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/createorder");
      console.log(res.data)

      if (res.data.success) {
        setOrders(res.data.orders);

      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div>
        <Sidebar />
        <h2 style={{ marginLeft: "260px", padding: "20px" }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />

      <div style={{ marginLeft: "260px", padding: "20px" }}>
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <h2>No Orders Found</h2>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3>Order ID: {order.orderId}</h3>

              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentmethod}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {order.paymentstatus}
              </p>

              <p>
                <strong>Total Amount:</strong> Rs.{" "}
                {order.totalAmount}
              </p>

              <h3>Shipping Address</h3>

              <p>Name: {order.shippingaddress.name}</p>
              <p>Phone: {order.shippingaddress.phone}</p>
              <p>Street: {order.shippingaddress.street}</p>
              <p>City: {order.shippingaddress.city}</p>
              <p>State: {order.shippingaddress.state}</p>
              <p>Zip Code: {order.shippingaddress.zipCode}</p>
              <p>Country: {order.shippingaddress.country}</p>

              <hr />

              <h3>Ordered Products</h3>

              {order.items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    border: "1px solid #eee",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.product.title}
                    width="120"
                    height="120"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <div>
                    <h4>{item.product.title}</h4>

                    <p>
                      <strong>Price:</strong> Rs. {item.price}
                    </p>

                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>

                    <p>
                      <strong>Subtotal:</strong> Rs.{" "}
                      {item.price * item.quantity}
                    </p>

                    <p>
                      <strong>Stock:</strong>{" "}
                      {item.product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;