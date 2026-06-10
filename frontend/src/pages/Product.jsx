import axios from "axios";
import React, { useEffect, useState } from "react";
import Slide from "../component/Slide";
import Category from "./Category";

const Product = () => {
  const [product, setproduct] = useState([]);

  const productfetch = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get");
      setproduct(res.data.product);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    productfetch();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
        <Slide/>
        <Category/>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Featured Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {item.description}
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-green-600">
                    Rs. {item.price}
                  </span>

                  <span className="text-sm text-gray-500 line-through">
                    Rs. {item.discounted}
                  </span>
                </div>

                              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;