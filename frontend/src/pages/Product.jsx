import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import { addtocart } from "../Redux/api.js";
import { useDispatch } from "react-redux";

/* ─────────────────────────────────────────────
   Global Styles & Animations
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  @keyframes pulseBadge {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.08); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes bounceIn {
    0%   { transform: scale(0.3); opacity: 0; }
    50%  { transform: scale(1.1); }
    70%  { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes heartPop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.4); }
    60%  { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  @keyframes toastSlide {
    0%   { opacity: 0; transform: translateY(16px); }
    15%  { opacity: 1; transform: translateY(0); }
    85%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  .anim-fade-up    { animation: fadeUp 0.55s ease both; }
  .anim-fade-in    { animation: fadeIn 0.4s ease both; }
  .anim-scale-in   { animation: scaleIn 0.45s ease both; }
  .anim-slide-left  { animation: slideLeft 0.55s ease both; }
  .anim-slide-right { animation: slideRight 0.55s ease both; }

  .d-100 { animation-delay: 0.10s; }
  .d-200 { animation-delay: 0.20s; }
  .d-300 { animation-delay: 0.30s; }
  .d-400 { animation-delay: 0.40s; }
  .d-500 { animation-delay: 0.50s; }

  /* Skeleton */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 37%, #f0f0f0 63%);
    background-size: 700px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 10px;
  }

  /* Swiper */
  .prod-main-swiper .swiper-button-next,
  .prod-main-swiper .swiper-button-prev {
    color: #fff;
    background: rgba(249,115,22,0.88);
    border-radius: 50%;
    width: 38px; height: 38px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    transition: background 0.2s, transform 0.2s;
  }
  .prod-main-swiper .swiper-button-next:hover,
  .prod-main-swiper .swiper-button-prev:hover {
    background: #ea580c;
    transform: scale(1.12);
  }
  .prod-main-swiper .swiper-button-next::after,
  .prod-main-swiper .swiper-button-prev::after { font-size: 13px; font-weight: 800; }
  .prod-main-swiper .swiper-pagination-bullet { background: #d1d5db; opacity: 1; transition: transform 0.2s; }
  .prod-main-swiper .swiper-pagination-bullet-active { background: #f97316; transform: scale(1.35); }

  .prod-thumb-swiper .swiper-slide-thumb-active .thumb-wrap {
    border-color: #f97316 !important;
    box-shadow: 0 0 0 2px rgba(249,115,22,0.25);
  }

  /* Buttons */
  .btn-buy {
    background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
    box-shadow: 0 4px 16px rgba(249,115,22,0.4);
    transition: filter 0.18s, transform 0.15s, box-shadow 0.18s;
  }
  .btn-buy:hover { filter: brightness(1.08); box-shadow: 0 6px 22px rgba(249,115,22,0.5); transform: translateY(-2px); }
  .btn-buy:active { transform: scale(0.97); }

  .btn-cart { transition: background 0.18s, transform 0.15s, box-shadow 0.18s, border-color 0.18s, color 0.18s; }
  .btn-cart:hover { background: #fff7ed; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(249,115,22,0.18); }
  .btn-cart:active { transform: scale(0.97); }
  .btn-cart.added { border-color: #22c55e !important; color: #16a34a !important; background: #f0fdf4 !important; }

  /* Product card */
  .prod-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .prod-card:hover { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(0,0,0,0.10); }
  .prod-card .card-img { transition: transform 0.38s ease; }
  .prod-card:hover .card-img { transform: scale(1.07); }

  /* Wishlist heart */
  .heart-btn { transition: transform 0.15s; }
  .heart-btn:hover { transform: scale(1.15); }
  .heart-btn.popped { animation: heartPop 0.4s ease; }

  /* Discount badge */
  .disc-badge { animation: pulseBadge 2.4s ease infinite; }

  /* Toast */
  .toast { animation: toastSlide 2.8s ease forwards; }

  /* Qty button */
  .qty-btn { transition: background 0.15s, transform 0.1s; }
  .qty-btn:hover { background: #fff7ed; }
  .qty-btn:active { transform: scale(0.88); }

  /* Tab underline */
  .tab-active::after {
    content: '';
    display: block;
    height: 2.5px;
    background: linear-gradient(90deg, #f97316, #dc2626);
    border-radius: 99px;
    margin-top: 4px;
  }
`;

/* ─────────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────── */
const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="skeleton h-4 w-48 mb-6 rounded-full" />
    <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="lg:w-[45%] flex flex-col gap-3">
        <div className="skeleton h-[380px] w-full rounded-2xl" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 flex-1 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="lg:w-[55%] flex flex-col gap-4 pt-2">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-9 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-11 w-44 rounded-xl" />
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          <div className="skeleton h-12 flex-1 rounded-2xl" />
          <div className="skeleton h-12 flex-1 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Star Rating
───────────────────────────────────────────── */
const StarRating = ({ rating = 0, count }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-[18px] h-[18px] ${
            i < Math.floor(rating) ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-sm font-semibold text-gray-700">
      {rating ? `${rating}/5` : "No ratings"}
    </span>
    {count && <span className="text-xs text-gray-400">({count} reviews)</span>}
  </div>
);

/* ─────────────────────────────────────────────
   Quantity Selector
───────────────────────────────────────────── */
const QuantitySelector = () => {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="qty-btn px-4 py-2.5 text-gray-500 text-xl font-light select-none"
      >
        −
      </button>
      <span className="px-5 py-2.5 text-sm font-bold text-gray-800 border-x-2 border-gray-100 min-w-[46px] text-center">
        {qty}
      </span>
      <button
        onClick={() => setQty((q) => q + 1)}
        className="qty-btn px-4 py-2.5 text-gray-500 text-xl font-light select-none"
      >
        +
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Trust Chips
───────────────────────────────────────────── */
const CHIPS = [
  { icon: "🔒", label: "Secure Payment" },
  { icon: "🚚", label: "Fast Delivery" },
  { icon: "🔄", label: "14-Day Returns" },
  { icon: "✅", label: "100% Genuine" },
];

/* ─────────────────────────────────────────────
   Toast Notification
───────────────────────────────────────────── */
const Toast = ({ message, type = "success" }) => (
  <div
    className={`toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold ${
      type === "success"
        ? "bg-gradient-to-r from-green-500 to-emerald-600"
        : "bg-gradient-to-r from-orange-500 to-red-500"
    }`}
  >
    <span>{type === "success" ? "✓" : "♥"}</span>
    {message}
  </div>
);

/* ─────────────────────────────────────────────
   Related Product Card with scroll reveal
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
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={
        visible
          ? { animation: `fadeUp 0.5s ease ${delay}ms both` }
          : { opacity: 0 }
      }
    >
      <div
        className="prod-card bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer"
        onClick={() => nav(`/product/${p._id}`)}
      >
        <div className="bg-gradient-to-br from-gray-50 to-white h-44 flex items-center justify-center p-3 overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="card-img h-36 w-full object-contain"
          />
        </div>
        <div className="p-3.5">
          {p.brand && (
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
              {p.brand}
            </p>
          )}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">
            {p.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-orange-500 font-extrabold text-sm">
              Rs. {p.price?.toLocaleString()}
            </span>
            <span className="text-[10px] bg-orange-50 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-100">
              View →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Product Component
───────────────────────────────────────────── */
const Product = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  // const [cart, setcart] = useState([]);
  const dispatch = useDispatch()

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // const cartfetch = async (item) => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8000/api/cart",
  //       {
  //         product: item._id,
  //         quantity: 1,
  //       },
  //       { withCredentials: true }
  //     );

  //     console.log("Cart Response:", res.data);

  //     setcart(res.data.cart.itemL);

  //     setTimeout(() => setcart(false), 2500);
  //   } catch (error) {
  //     console.log("Add to cart error:", error.response?.data || error.message);
  //     showToast("Failed to add to cart", "error");
  //   }
  // };
  const fetchProductId = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/gets/${id}`);
      setProduct([res.data.product]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get");
      setProducts(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductId();
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleWishlist = () => {
    setWishlisted((w) => !w);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist ♥",
      wishlisted ? "success" : "wish"
    );
  };

  const handleAddToCart = (item) => {
    console.log(item);

    setCartAdded(true);
    dispatch(
      addtocart({
        product: item,
        quantity: 1,
      })
    );

    // cartfetch(item);
    showToast("Added to cart successfully!");
    // setTimeout(() => setcart(false), 2500);
     nav("/cart");
  };

  if (loading)
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <SkeletonLoader />
      </>
    );

  if (!data || data.length === 0)
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
          <button
            onClick={() => nav(-1)}
            className="btn-buy text-white font-bold px-6 py-3 rounded-2xl text-sm"
          >
            ← Go Back
          </button>
        </div>
      </>
    );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {toast && <Toast message={toast.msg} type={toast.type} />}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {data.map((item) => {
          const images = item.images?.length > 0 ? item.images : [item.image];
          const discount = item.originalPrice
            ? Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100
              )
            : null;

          return (
            <div key={item._id} className="anim-fade-in">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 anim-fade-up">
                <span
                  className="hover:text-orange-500 cursor-pointer transition-colors"
                  onClick={() => nav("/")}
                >
                  Home
                </span>
                <span className="text-gray-300">/</span>
                <span
                  className="hover:text-orange-500 cursor-pointer transition-colors"
                  onClick={() => nav(-1)}
                >
                  Products
                </span>
                <span className="text-gray-300">/</span>
                {item.category?.title && (
                  <>
                    <span className="text-gray-400">{item.category.title}</span>
                    <span className="text-gray-300">/</span>
                  </>
                )}
                <span className="text-gray-700 font-semibold truncate max-w-[180px]">
                  {item.title}
                </span>
              </nav>

              {/* Main Card */}
              <div className="flex flex-col lg:flex-row gap-0 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                {/* ── LEFT: Image Panel ── */}
                <div className="lg:w-[45%] p-5 flex flex-col gap-3 anim-slide-left bg-gradient-to-br from-white to-orange-50/30">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {discount && (
                      <span className="disc-badge text-[11px] font-extrabold bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full shadow">
                        -{discount}% OFF
                      </span>
                    )}
                    {item.discounted && (
                      <span className="text-[11px] font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                        🏷️ {item.discounted}% Discount
                      </span>
                    )}
                    <span className="text-[11px] font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                      ✓ In Stock
                    </span>
                  </div>

                  {/* Main Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-inner">
                    {/* Wishlist */}
                    <button
                      onClick={handleWishlist}
                      className={`heart-btn ${
                        heartAnim ? "popped" : ""
                      } absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100`}
                    >
                      <svg
                        className={`w-5 h-5 transition-all ${
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
                      modules={[Navigation, Pagination, Autoplay, Thumbs]}
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
                      className="prod-main-swiper"
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img}
                            alt={`${item.title} ${idx + 1}`}
                            className="w-full h-[320px] sm:h-[390px] object-contain p-5 transition-opacity duration-300"
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
                      className="prod-thumb-swiper w-full"
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="thumb-wrap border-2 border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-orange-300 transition-all duration-200 bg-white">
                            <img
                              src={img}
                              alt={`thumb-${idx}`}
                              className="w-full h-[62px] object-contain p-1"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}

                  {/* Trust chips */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {CHIPS.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-sm"
                      >
                        <span className="text-base">{c.icon}</span>
                        <span className="text-[11px] text-gray-600 font-semibold">
                          {c.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT: Details Panel ── */}
                <div className="lg:w-[55%] p-6 sm:p-8 flex flex-col justify-start gap-5 lg:border-l border-gray-100 anim-slide-right">
                  {/* Brand */}
                  {item.brand && (
                    <span className="anim-fade-up d-100 inline-flex w-fit items-center gap-1.5 text-xs font-extrabold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block animate-pulse" />
                      {item.brand}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="anim-fade-up d-200 text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                    {item.title}
                  </h1>

                  {/* Rating */}
                  <div className="anim-fade-up d-300">
                    <StarRating rating={item.rating} />
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-orange-100 via-gray-100 to-transparent" />

                  {/* Price */}
                  <div className="anim-fade-up d-300 flex flex-wrap items-end gap-3">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                      Rs. {item.price?.toLocaleString() ?? item.sortorder}
                    </span>
                    {item.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base text-gray-400 line-through">
                          Rs. {item.originalPrice.toLocaleString()}
                        </span>
                        <span className="disc-badge text-xs font-extrabold text-white bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-0.5 rounded-full">
                          Save Rs.{" "}
                          {(item.originalPrice - item.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tabs: Description / Details */}
                  <div className="anim-fade-up d-400">
                    <div className="flex gap-5 border-b border-gray-100 text-sm font-semibold text-gray-400">
                      {["description", "details"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-2 capitalize transition-colors ${
                            activeTab === tab
                              ? "text-orange-500 tab-active"
                              : "hover:text-gray-600"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3">
                      {activeTab === "description" ? (
                        <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-orange-200 pl-3">
                          {item.description ||
                            "No description available for this product."}
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {[
                            { label: "Code", val: item.code },
                            {
                              label: "Category",
                              val: item.category?.title,
                              truncate: true,
                            },
                            item.scent && { label: "Scent", val: item.scent },
                            item.volume && {
                              label: "Volume",
                              val: item.volume,
                            },
                            item.discounted && {
                              label: "Discount",
                              val: `${item.discounted}%`,
                            },
                          ]
                            .filter(Boolean)
                            .map((m, i) => (
                              <div
                                key={i}
                                className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                              >
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">
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
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-orange-100 via-gray-100 to-transparent" />

                  {/* Delivery Banner */}
                  <div className="anim-fade-up d-400 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 flex items-center gap-4 border border-orange-100">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-orange-100 flex-shrink-0">
                      🚚
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-800 text-sm">
                        Standard Delivery · 3–5 Days
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Cash on Delivery &amp; Online Payment Available
                      </p>
                    </div>
                  </div>

                  {/* Quantity + Buttons */}
                  <div className="anim-fade-up d-500 flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 font-medium w-20">
                        Quantity
                      </span>
                      <QuantitySelector />
                    </div>

                    <div className="flex gap-3">
                      <button className="btn-buy flex-1 text-white font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`btn-cart ${
                          cartAdded
                            ? "added"
                            : "border-orange-400 text-orange-500"
                        } flex-1 border-2 font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2`}
                      >
                        {cartAdded ? (
                          <>
                            <span className="text-base">✓</span> Added!
                          </>
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h6"
                              />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    {/* Return + Share row */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
                          🔄
                        </span>
                        14 Days Free Returns · No Questions Asked
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          showToast("Link copied!");
                        }}
                        className="text-xs text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RELATED PRODUCTS ── */}
              {products.length > 0 && (
                <div className="mt-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 bg-gradient-to-b from-orange-500 to-red-400 rounded-full" />
                    <h2 className="text-xl font-extrabold text-gray-900">
                      More Products
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-100 to-transparent" />
                    <button
                      onClick={() => nav("/")}
                      className="text-xs font-bold text-orange-500 hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((p, i) => (
                      <RelatedCard key={p._id} p={p} nav={nav} delay={i * 55} />
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

export default Product;
