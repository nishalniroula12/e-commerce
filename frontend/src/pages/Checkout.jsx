import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// ─── Design tokens ───────────────────────────────────────────────────────────
// Palette: deep slate bg, soft white surface, indigo accent, warm coral CTA
// Type: system-ui for utility, heavier weight display for totals
// Signature: staggered card entrance + a live pulse on the CTA button
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px 80px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: 860,
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 24,
  },
  // ── Left column ──
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#6366f1",
    marginBottom: 8,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "20px 24px",
    backdropFilter: "blur(10px)",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  itemImg: {
    width: 68,
    height: 68,
    borderRadius: 10,
    objectFit: "cover",
    background: "rgba(99,102,241,0.15)",
    flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#f1f5f9",
    marginBottom: 4,
  },
  itemQty: {
    fontSize: 13,
    color: "#94a3b8",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 700,
    color: "#818cf8",
    whiteSpace: "nowrap",
  },
  // ── Inputs ──
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#94a3b8",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  // ── Payment chips ──
  paymentRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
  },
  chip: (selected) => ({
    padding: "10px 20px",
    borderRadius: 10,
    border: selected
      ? "1.5px solid #6366f1"
      : "1.5px solid rgba(255,255,255,0.1)",
    background: selected ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
    color: selected ? "#a5b4fc" : "#94a3b8",
    fontWeight: selected ? 700 : 500,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    userSelect: "none",
  }),
  // ── Right column / summary ──
  right: {
    position: "sticky",
    top: 40,
    alignSelf: "flex-start",
  },
  summaryCard: {
    background: "rgba(99,102,241,0.07)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 16,
    padding: "24px",
    backdropFilter: "blur(10px)",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#e2e8f0",
    marginBottom: 20,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 10,
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 20,
    fontWeight: 800,
    color: "#f1f5f9",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: 16,
    marginTop: 8,
  },
  cta: {
    marginTop: 24,
    width: "100%",
    padding: "15px 0",
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.02em",
    boxShadow: "0 0 24px rgba(99,102,241,0.35)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#64748b",
    marginTop: 14,
    justifyContent: "center",
    width: "100%",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e2e8f0",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#64748b",
  },
};

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const PAYMENT_METHODS = [
    {
      id: "cod",
      label: "COD",
    },
    {
      id: "khalti",
      label: "Khalti",
      logo: "https://khalti.com/static/khalti-logo.svg",
    },
    {
      id: "esewa",
      label: "eSewa",
      logo: "https://esewa.com.np/common/images/esewa_logo.png",
    },
  ];
// ─────────────────────────────────────────────────────────────────────────────

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.itemL);
  const [payment, setPayment] = useState("cod");
  const [address, setAddress] = useState("");
  const [focused, setFocused] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  ) ?? 0;
  const shipping = subtotal > 2000 ? 0 : 120;
  const total = subtotal + shipping;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={styles.page}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={styles.emptyState}
        >
          <div style={styles.emptyIcon}>🛒</div>
          <div style={styles.emptyTitle}>Your cart is empty</div>
          <div style={styles.emptyText}>Add some items to continue shopping.</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <AnimatePresence>
        {placed ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...styles.emptyState, maxWidth: 420 }}
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              style={styles.emptyIcon}
            >
              ✅
            </motion.div>
            <div style={styles.emptyTitle}>Order Placed!</div>
            <div style={styles.emptyText}>
              Your order has been confirmed. We'll notify you when it ships.
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="checkout"
            style={styles.container}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* ── Left column ── */}
            <div style={styles.left}>
              {/* Items */}
              <motion.div variants={fadeUp} custom={0} style={styles.card}>
                <div style={styles.sectionLabel}>Your Items</div>
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                  {cartItems.map((item, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      custom={i}
                      style={{
                        ...styles.itemRow,
                        ...(i === cartItems.length - 1
                          ? { borderBottom: "none", paddingBottom: 0 }
                          : {}),
                      }}
                    >
                      <img
                        src={item.image || "https://placehold.co/68x68/1e293b/6366f1?text=📦"}
                        alt={item.name}
                        style={styles.itemImg}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/68x68/1e293b/6366f1?text=📦";
                        }}
                      />
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div style={styles.itemQty}>Qty: {item.quantity}</div>
                      </div>
                      <div style={styles.itemPrice}>Rs {(item.price * item.quantity).toLocaleString()}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Address */}
              <motion.div variants={fadeUp} custom={1} style={styles.card}>
                <div style={styles.sectionLabel}>Delivery Address</div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Street / Area / City</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      ...styles.input,
                      borderColor: focused
                        ? "#6366f1"
                        : "rgba(255,255,255,0.1)",
                    }}
                    placeholder="e.g. Thamel, Kathmandu 44600"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div variants={fadeUp} custom={2} style={styles.card}>
                <div style={styles.sectionLabel}>Payment Method</div>
                <div style={styles.paymentRow}>
                  {PAYMENT_METHODS.map((m) => (
                    <motion.button
                      key={m.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={styles.chip(payment === m.id)}
                      onClick={() => setPayment(m.id)}
                    >
                      {m.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Right column / summary ── */}
            <motion.div variants={fadeUp} custom={0.5} style={styles.right}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryTitle}>Order Summary</div>

                <div style={styles.summaryRow}>
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span style={{ color: "#e2e8f0" }}>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#34d399" : "#e2e8f0" }}>
                    {shipping === 0 ? "Free" : `Rs ${shipping}`}
                  </span>
                </div>

                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: "#a5b4fc" }}
                  >
                    Rs {total.toLocaleString()}
                  </motion.span>
                </div>

                {/* CTA */}
                <motion.button
                  style={styles.cta}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 36px rgba(99,102,241,0.55)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(99,102,241,0.30)",
                      "0 0 32px rgba(99,102,241,0.55)",
                      "0 0 20px rgba(99,102,241,0.30)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                  onClick={() => {
                    if (address.trim()) setPlaced(true);
                  }}
                >
                  Place Order →
                </motion.button>

                <div style={styles.badge}>
                  🔒 Secure checkout &nbsp;·&nbsp; Fast delivery
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive overrides via injected style tag */}
      <style>{`
        @media (max-width: 680px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input::placeholder { color: #475569; }
        input:focus { outline: none; }
        button:focus-visible { outline: 2px solid #6366f1; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;