import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Thumbs,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ─────────────────────────────────────────────
   Inline keyframe styles injected once
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { font-family: 'Inter', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-badge {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.07); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .animate-fade-up   { animation: fadeUp 0.55s ease both; }
  .animate-fade-in   { animation: fadeIn 0.4s ease both; }
  .animate-scale-in  { animation: scaleIn 0.45s ease both; }
  .animate-slide-left  { animation: slideInLeft 0.55s ease both; }
  .animate-slide-right { animation: slideInRight 0.55s ease both; }

  .delay-100 { animation-delay: 0.10s; }
  .delay-200 { animation-delay: 0.20s; }
  .delay-300 { animation-delay: 0.30s; }
  .delay-400 { animation-delay: 0.40s; }
  .delay-500 { animation-delay: 0.50s; }
  .delay-600 { animation-delay: 0.60s; }

  /* Swiper overrides */
  .main-swiper .swiper-button-next,
  .main-swiper .swiper-button-prev {
    color: #fff;
    background: rgba(249,115,22,0.85);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    transition: background 0.2s, transform 0.2s;
  }
  .main-swiper .swiper-button-next:hover,
  .main-swiper .swiper-button-prev:hover {
    background: #ea580c;
    transform: scale(1.1);
  }
  .main-swiper .swiper-button-next::after,
  .main-swiper .swiper-button-prev::after { font-size: 13px; font-weight: 800; }
  .main-swiper .swiper-pagination-bullet { background: #d1d5db; opacity: 1; }
  .main-swiper .swiper-pagination-bullet-active {
    background: #f97316;
    transform: scale(1.3);
    transition: transform 0.2s;
  }
  .thumb-swiper .swiper-slide-thumb-active .thumb-img-wrap {
    border-color: #f97316 !important;
    box-shadow: 0 0 0 2px rgba(249,115,22,0.3);
  }

  /* Card hover lift */
  .product-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.10);
  }
  .product-card .card-img {
    transition: transform 0.35s ease;
  }
  .product-card:hover .card-img {
    transform: scale(1.06);
  }

  /* Skeleton shimmer */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
  }

  /* Quantity button */
  .qty-btn {
    transition: background 0.15s, transform 0.1s;
  }
  .qty-btn:hover  { background: #fff7ed; }
  .qty-btn:active { transform: scale(0.9); }

  /* CTA buttons */
  .btn-primary {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
    box-shadow: 0 4px 14px rgba(249,115,22,0.35);
  }
  .btn-primary:hover {
    filter: brightness(1.07);
    box-shadow: 0 6px 20px rgba(249,115,22,0.45);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: scale(0.97); }

  .btn-outline {
    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  }
  .btn-outline:hover {
    background: #fff7ed;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(249,115,22,0.15);
  }
  .btn-outline:active { transform: scale(0.97); }

  /* Badge pulse */
  .discount-badge { animation: pulse-badge 2.2s ease infinite; }

  /* Related section entry */
  .related-card-wrapper {
    opacity: 0;
  }
  .related-card-wrapper.visible {
    animation: fadeUp 0.5s ease forwards;
  }
`;

/* ─────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────── */
const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
      <div className="md:w-[45%] flex flex-col gap-3">
        <div className="skeleton h-[360px] w-full rounded-xl" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 flex-1 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="md:w-[55%] flex flex-col gap-4 pt-2">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-10 w-40 rounded" />
        <div className="skeleton h-20 w-full rounded" />
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-10 rounded" />
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-12 flex-1 rounded-xl" />
          <div className="skeleton h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Star Rating
───────────────────────────────────────────── */
const StarRating = ({ rating = 0 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < full
                ? "text-amber-400"
                : i === full && half
                ? "text-amber-300"
                : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500 font-medium">
        {rating ? `${rating}/5` : "No ratings yet"}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Quantity Selector
───────────────────────────────────────────── */
const QuantitySelector = () => {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="qty-btn px-4 py-2.5 text-gray-500 text-xl font-light leading-none select-none"
      >
        −
      </button>
      <span className="px-5 py-2.5 text-sm font-bold text-gray-800 border-x-2 border-gray-100 min-w-[48px] text-center">
        {qty}
      </span>
      <button
        onClick={() => setQty((q) => q + 1)}
        className="qty-btn px-4 py-2.5 text-gray-500 text-xl font-light leading-none select-none"
      >
        +
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Feature Chips
───────────────────────────────────────────── */
const chips = [
  { icon: "🔒", label: "Secure Payment" },
  { icon: "🚚", label: "Free Delivery ₹999+" },
  { icon: "🔄", label: "14-Day Returns" },
  { icon: "✅", label: "100% Genuine" },
];

/* ─────────────────────────────────────────────
   Related Product Card
───────────────────────────────────────────── */
const RelatedCard = ({ p, nav, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="related-card-wrapper"
      style={
        visible ? { animation: `fadeUp 0.5s ease ${delay}ms forwards` } : {}
      }
    >
      <div
        className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer group"
        onClick={() => nav(`/product/${p._id}`)}
      >
        <div className="overflow-hidden bg-gray-50 h-44 flex items-center justify-center p-3">
          <img
            src={p.image}
            alt={p.title}
            className="card-img h-36 w-full object-contain"
          />
        </div>
        <div className="p-3">
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">
            {p.brand || "Product"}
          </p>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">
            {p.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-orange-500 font-bold text-sm">
              Rs. {p.price?.toLocaleString()}
            </span>
            <span className="text-[10px] bg-orange-50 text-orange-400 font-semibold px-2 py-0.5 rounded-full">
              View →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Category = () => {
  const [data, setCategory] = useState([]);
  const [product, setdata] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [cart, setcart] = useState([]);
  const { id } = useParams();
  const nav = useNavigate();

  const cartfetch = async (item) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/cart",
        {
          product: item._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      console.log("Cart Response:", res.data);

      setcart(res.data.cart.itemL);

      setTimeout(() => setcart(false), 2500);
    } catch (error) {
      console.log("Add to cart error:", error.response?.data || error.message);
    }
  };
 const fetchCategoryId = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/system/${id}`);
      const categoryData = res.data.category;
      setCategory(Array.isArray(categoryData) ? categoryData : [categoryData]);
    } catch (error) {
      console.log(error);
    }
  };

  const productfetchdata = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get");
      setdata(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryId();
    productfetchdata();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleAddToCart = (item) => {
    setCartAdded(true);
cartfetch(item)
    setTimeout(() => setcart(false), 2000);
    nav("/cart");
  };

  if (data.length === 0)
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <SkeletonLoader />
      </>
    );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {data.map((item) => {
          const discount = item.originalPrice
            ? Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100
              )
            : null;
          const images = item.images?.length > 0 ? item.images : [item.image];

          return (
            <div key={item._id} className="animate-scale-in">
              {/* ── Breadcrumb ── */}
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 animate-fade-in">
                <span
                  className="hover:text-orange-500 cursor-pointer transition-colors"
                  onClick={() => nav("/")}
                >
                  Home
                </span>
                <span>/</span>
                <span
                  className="hover:text-orange-500 cursor-pointer transition-colors"
                  onClick={() => nav(-1)}
                >
                  Products
                </span>
                <span>/</span>
                <span className="text-gray-700 font-medium truncate max-w-[180px]">
                  {item.title}
                </span>
              </nav>

              {/* ── Main Card ── */}
              <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* LEFT: Images */}
                <div className="lg:w-[45%] p-5 flex flex-col gap-3 animate-slide-left">
                  {/* Badge row */}
                  <div className="flex items-center gap-2 mb-1">
                    {discount && (
                      <span className="discount-badge text-[11px] font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                        -{discount}% OFF
                      </span>
                    )}
                    <span className="text-[11px] font-semibold bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full border border-green-100">
                      ✓ In Stock
                    </span>
                  </div>

                  {/* Main Swiper */}
                  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-inner relative">
                    {/* Wishlist button */}
                    <button
                      onClick={() => setWishlisted((w) => !w)}
                      className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-all hover:scale-110 active:scale-90"
                      style={{ transition: "transform 0.18s" }}
                    >
                      <svg
                        className={`w-4.5 h-4.5 ${
                          wishlisted
                            ? "text-red-500 fill-red-500"
                            : "text-gray-300 fill-none"
                        }`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    <Swiper
                      modules={[
                        Navigation,
                        Pagination,
                        Autoplay,
                        Thumbs,
                        EffectFade,
                      ]}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 3500, disableOnInteraction: false }}
                      loop={images.length > 1}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      className="main-swiper"
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img}
                            alt={`${item.title} ${idx + 1}`}
                            className="w-full h-[340px] sm:h-[400px] object-contain p-5 transition-opacity duration-300"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      modules={[Thumbs]}
                      spaceBetween={8}
                      slidesPerView={Math.min(images.length, 5)}
                      watchSlidesProgress
                      className="thumb-swiper w-full"
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="thumb-img-wrap border-2 border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-orange-300 transition-all duration-200 bg-gray-50">
                            <img
                              src={img}
                              alt={`thumb-${idx}`}
                              className="w-full h-[64px] object-contain p-1"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}

                  {/* Feature chips */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {chips.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100"
                      >
                        <span className="text-base">{c.icon}</span>
                        <span className="text-[11px] text-gray-600 font-medium">
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Details */}
                <div className="lg:w-[55%] p-6 flex flex-col justify-start gap-4 lg:border-l border-gray-100 animate-slide-right">
                  {/* Brand */}
                  {item.brand && (
                    <span className="inline-flex w-fit items-center gap-1 text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                      {item.brand}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                    {item.title}
                  </h1>

                  {/* Rating */}
                  <StarRating rating={item.rating} />

                  <div className="h-px bg-gradient-to-r from-orange-100 via-gray-100 to-transparent" />

                  {/* Price block */}
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                      Rs. {item.price?.toLocaleString() ?? item.sortorder}
                    </span>
                    {item.originalPrice && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base text-gray-400 line-through">
                          Rs. {item.originalPrice.toLocaleString()}
                        </span>
                        <span className="discount-badge text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 rounded-full">
                          Save Rs.{" "}
                          {(item.originalPrice - item.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-orange-200 pl-3">
                    {item.description}
                  </p>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Sort Order", val: item.sortorder },
                      { label: "Category ID", val: item._id, truncate: true },
                      item.scent && { label: "Scent", val: item.scent },
                      item.volume && { label: "Volume", val: item.volume },
                    ]
                      .filter(Boolean)
                      .map((m, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                        >
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
                            {m.label}
                          </p>
                          <p
                            className={`font-bold text-gray-800 text-sm ${
                              m.truncate ? "truncate" : ""
                            }`}
                          >
                            {m.val}
                          </p>
                        </div>
                      ))}
                  </div>

                  <div className="h-px bg-gradient-to-r from-orange-100 via-gray-100 to-transparent" />

                  {/* Delivery */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 flex items-center gap-4 border border-orange-100">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm text-2xl border border-orange-100">
                      🚚
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        Standard Delivery · 3–5 days
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Cash on Delivery &amp; Online Payment Available
                      </p>
                    </div>
                  </div>

                  {/* Quantity + CTA */}
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 font-medium">
                        Quantity
                      </span>
                      <QuantitySelector />
                    </div>

                    <div className="flex gap-3">
                      <button className="btn-primary flex-1 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleAddToCart(item._id)}
                        className={`btn-outline flex-1 border-2 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all ${
                          cartAdded
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-400 text-orange-500"
                        }`}
                      >
                        {cartAdded ? (
                          <>✓ Added!</>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Return policy */}
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
                      🔄
                    </span>
                    14 Days Free Returns · No Questions Asked
                  </p>
                </div>
              </div>

              {/* ── RELATED PRODUCTS ── */}
              {product.length > 0 && (
                <div className="mt-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 bg-gradient-to-b from-orange-500 to-red-400 rounded-full" />
                    <h2 className="text-xl font-extrabold text-gray-900">
                      More Products
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-100 to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {product.map((p, i) => (
                      <RelatedCard key={p._id} p={p} nav={nav} delay={i * 60} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Category;
