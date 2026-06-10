import React, { useEffect, useState } from "react";
import Slide from "../component/Slide";
import axios from "axios";
import Product from "./Product";

const Category = () => {
  const [data, setcategory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchcategory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/public");
      setcategory(res.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchcategory();
  }, []);

  return (
    <div className="w-full">
<Product/>      

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dropdown */}
        <div className="relative inline-block mb-6">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Categories ▼
          </button>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-3">
                <h2 className="text-center font-semibold text-lg">
                  {item.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
</div>
  )
}

export default Category;