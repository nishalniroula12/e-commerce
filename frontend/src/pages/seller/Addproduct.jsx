import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../component/Sidebar";

// ── animation variants ────────────────────────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 16,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.22 + i * 0.06, duration: 0.3 },
  }),
};

// ── component ────────────────────────────────────────────────
const Addproduct = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const isedit = Boolean(id);

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState([]);

  const [initialValues, setInitialValues] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    discounted: "",
    stock: "",
    code: "",
    status: "",
    rating: "",
    category: "",
    image: null,
  });

  const fields = [
    { name: "title", label: "Title", placeholder: "Title", type: "text" },
    { name: "slug", label: "Slug", placeholder: "Slug", type: "text" },
    { name: "description", label: "Description", placeholder: "Description", type: "text" },
    { name: "price", label: "Price", placeholder: "Price", type: "number" },
    { name: "discounted", label: "Discounted Price", placeholder: "Discounted Price", type: "number" },
    { name: "stock", label: "Stock", placeholder: "Stock", type: "number" },
    { name: "code", label: "Code", placeholder: "Code", type: "text" },
    { name: "rating", label: "Rating", placeholder: "Rating", type: "number" },
  ];

  useEffect(() => {
    const fetchCat = async () => {
      const res = await axios.get("http://localhost:8000/api/public");
      setCategory(res.data.category);
    };
    fetchCat();
  }, []);

  useEffect(() => {
    if (!isedit) return;

    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:8000/api/gets/${id}`);
      const p = res.data.product;

      setInitialValues({
        title: p.title || "",
        slug: p.slug || "",
        description: p.description || "",
        price: p.price || "",
        discounted: p.discounted || "",
        stock: p.stock || "",
        code: p.code || "",
        rating: p.rating || "",
        status: p.status || "",
        category: p.category?._id || "",
        image: null,
      });
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="mb-4">
        <button
          onClick={() => nav("/allproduct")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 flex justify-center p-6">
        <motion.div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">

          <h2 className="text-2xl font-bold mb-1">
            {isedit ? "Edit Product" : "Add Product"}
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            Fill product details below
          </p>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={async (values, { resetForm }) => {
              const formData = new FormData();

              Object.keys(values).forEach((key) => {
                if (key === "image" && !values.image) return;
                formData.append(key, values[key]);
              });

              if (isedit) {
                await axios.put(`http://localhost:8000/api/levelup/${id}`, formData);
              } else {
                await axios.post("http://localhost:8000/api/product", formData);
              }

              setShowModal(true);
              resetForm();

              setTimeout(() => nav("/allproduct"), 1200);
            }}
          >
            {({ handleChange, handleSubmit, setFieldValue, values }) => (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* INPUT FIELDS WITH LABELS */}
                {fields.map((f, i) => (
                  <motion.div key={f.name} custom={i} variants={itemVariants}>
                    
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      {f.label}
                    </label>

                    <input
                      type={f.type}
                      name={f.name}
                      value={values[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full border p-3 rounded-xl"
                    />
                  </motion.div>
                ))}

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>

                  <select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  >
                    <option value="">Select Category</option>
                    {category.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>

                  <select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  >
                    <option value="">Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* IMAGE */}
                <div className="border-2 border-dashed p-4 rounded-xl">
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>

                  <input
                    type="file"
                    onChange={(e) =>
                      setFieldValue("image", e.target.files[0])
                    }
                  />
                </div>

                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl">
                  {isedit ? "Update Product" : "Save Product"}
                </button>
              </form>
            )}
          </Formik>
        </motion.div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white p-6 rounded-xl text-center">
              <h2 className="text-green-600 font-bold">
                {isedit ? "Updated Successfully!" : "Created Successfully!"}
              </h2>

              <button onClick={() => nav("/allproduct")}>
                Go to list
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Addproduct;