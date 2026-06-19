import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../component/Sidebar";

// ── animation variants ──────────────────────────────────────────────────────
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

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.15 },
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

// ── component ────────────────────────────────────────────────────────────────
const Addcategory = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const isedit = Boolean(id);

  const [showModal, setShowModal] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    slug: "",
    status: "",
    sortorder: "",
    image: null,
  });

  const fields = [
    { name: "title", placeholder: "Title", type: "text" },
    { name: "slug", placeholder: "Slug", type: "text" },
    { name: "description", placeholder: "Description", type: "text" },
    { name: "status", placeholder: "Status (e.g. active)", type: "text" },
    { name: "sortorder", placeholder: "Sort Order", type: "number" },
  ];

  // ── FETCH DATA FOR EDIT ─────────────────────────────────────────────
  useEffect(() => {
    if (!isedit) return;

    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/system/${id}`);

        const cat = res.data.category;

        setInitialValues({
          title: cat.title || "",
          description: cat.description || "",
          slug: cat.slug || "",
          status: cat.status || "",
          sortorder: cat.sortorder || "",
          image: cat.image || null,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategory();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="mb-4">
        <button
          onClick={() => nav("/allcategory")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          ← Back
        </button>
      </div>
      <div className="flex-1 flex justify-center items-start p-4 sm:p-8">
        <motion.div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6 sm:p-8 mt-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {isedit ? "Edit Category" : "Add Category"}
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            Fill in the details below.
          </p>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={async (values, { resetForm }) => {
              try {
                const formData = new FormData();

                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("slug", values.slug);
                formData.append("status", values.status);
                formData.append("sortorder", values.sortorder);

                if (values.image instanceof File) {
                  formData.append("image", values.image);
                  console.log(values.image);
                }

                if (isedit) {
                  await axios.put(
                    `http://localhost:8000/api/edit/${id}`,
                    formData
                  );
               } else {
                  await axios.post(
                    "http://localhost:8000/api/create",
                    formData
                  );
                }

                setShowModal(true);
                resetForm();

                setTimeout(() => {
                  nav("/allcategory");
                }, 1200);
              } catch (error) {
                console.log(error.response?.data || error.message);
              }
            }}
          >
            {({ handleChange, handleSubmit, setFieldValue, values }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((f, i) => (
                  <motion.div
                    key={f.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
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

                {/* IMAGE */}
                <motion.div className="border-2 border-dashed p-4 rounded-xl">
                  <label className="cursor-pointer flex flex-col items-center">
                    <span>🖼 Upload Image</span>
                    <span className="text-sm text-gray-500">
                      {values.image ? values.image : "Choose file"}
                    </span>

                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        setFieldValue("image", e.target.files[0])
                      }
                    />
                  </label>
                </motion.div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl"
                >
                  {isedit ? "Update Category" : "Save Category"}
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
            onClick={() => {
              setShowModal(false);
              nav("/allcategory");
            }}
          >
            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-green-600 font-bold">
                {isedit ? "Updated Successfully!" : "Created Successfully!"}
              </h2>

              <button onClick={() => nav("/allcategory")}>Go to list</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Addcategory;
