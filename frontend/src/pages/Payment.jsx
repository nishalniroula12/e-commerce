import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const Payment = ({ totalAmount = 1000 }) => {
  const [signature, setSignature] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nav =useNavigate()
  const {id} =useParams()
  console.log(id)
  const [transactionUUID] = useState(
    `${Date.now()}${Math.floor(Math.random() * 10000)}`
  );

  const amount = Number(totalAmount);
  const taxAmount = 10;
  const productServiceCharge = 0;
  const productDeliveryCharge = 0;
  const totalAmountToPay = amount + taxAmount + productServiceCharge + productDeliveryCharge;
  const productCode = "EPAYTEST";

  useEffect(() => {
    generateSignature();
  }, []);

  const generateSignature = async () => {
    try {
      const message = `total_amount=${totalAmountToPay},transaction_uuid=${transactionUUID},product_code=${productCode}`;
      const secretKey = "8gBm/:&EnhH.1/q";
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secretKey),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
      const generatedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
      setSignature(generatedSignature);
      setIsLoading(false);
    } catch (error) {
      console.error("Signature Generation Error:", error);
      setIsLoading(false);
    }
  };

  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a2e1a 0%, #0f4a2c 50%, #0a2e1a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "20px",
    },
    card: {
      background: "#ffffff",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "420px",
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
    },
    header: {
      background: "linear-gradient(135deg, #1a6b3a 0%, #2d9e5a 100%)",
      padding: "28px 32px",
      position: "relative",
      overflow: "hidden",
    },
    headerAccent: {
      position: "absolute",
      top: "-30px",
      right: "-30px",
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
    },
    headerAccent2: {
      position: "absolute",
      bottom: "-20px",
      left: "60px",
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
    },
    esewaLogo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "6px",
    },
    logoMark: {
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: "900",
      color: "#1a6b3a",
      letterSpacing: "-1px",
    },
    logoText: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: "0.3px",
    },
    headerSub: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.7)",
      marginTop: "2px",
    },
    body: {
      padding: "28px 32px 32px",
    },
    sectionLabel: {
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      color: "#9ca3af",
      marginBottom: "14px",
    },
    breakdown: {
      background: "#f9fafb",
      borderRadius: "12px",
      padding: "16px 20px",
      marginBottom: "24px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 0",
    },
    rowLabel: {
      fontSize: "14px",
      color: "#6b7280",
    },
    rowValue: {
      fontSize: "14px",
      color: "#374151",
      fontWeight: "500",
    },
    divider: {
      height: "1px",
      background: "#e5e7eb",
      margin: "10px 0",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "4px",
    },
    totalLabel: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#111827",
    },
    totalValue: {
      fontSize: "20px",
      fontWeight: "800",
      color: "#1a6b3a",
    },
    secureNote: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "20px",
      padding: "10px 14px",
      background: "#f0fdf4",
      borderRadius: "8px",
      border: "1px solid #bbf7d0",
    },
    secureIcon: {
      fontSize: "14px",
    },
    secureText: {
      fontSize: "12px",
      color: "#166534",
    },
    txnId: {
      fontSize: "11px",
      color: "#9ca3af",
      marginBottom: "20px",
      fontFamily: "monospace",
    },
    button: {
      width: "100%",
      padding: "15px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #1a6b3a 0%, #2d9e5a 100%)",
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      letterSpacing: "0.3px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "opacity 0.2s",
      boxShadow: "0 4px 14px rgba(26,107,58,0.35)",
    },
    loadingButton: {
      width: "100%",
      padding: "15px",
      borderRadius: "12px",
      border: "none",
      background: "#e5e7eb",
      color: "#9ca3af",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "not-allowed",
      letterSpacing: "0.3px",
    },
  };

  return (
    
    <div style={styles.wrapper}>
      <>
      <button onClick={()=>nav(`/payment/${id}`)}>Go Back</button>
      </>
       
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerAccent} />
          <div style={styles.headerAccent2} />
          <div style={styles.esewaLogo}>
            <div style={styles.logoMark}>e</div>
            <span style={styles.logoText}>eSewa</span>
          </div>
          <div style={styles.headerSub}>Secure digital payment</div>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <div style={styles.sectionLabel}>Order Summary</div>

          <div style={styles.breakdown}>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Subtotal</span>
              <span style={styles.rowValue}>Rs. {amount.toLocaleString()}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Tax</span>
              <span style={styles.rowValue}>Rs. {taxAmount}</span>
            </div>
            {productServiceCharge > 0 && (
              <div style={styles.row}>
                <span style={styles.rowLabel}>Service charge</span>
                <span style={styles.rowValue}>Rs. {productServiceCharge}</span>
              </div>
            )}
            {productDeliveryCharge > 0 && (
              <div style={styles.row}>
                <span style={styles.rowLabel}>Delivery</span>
                <span style={styles.rowValue}>Rs. {productDeliveryCharge}</span>
              </div>
            )}
            <div style={styles.divider} />
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total due</span>
              <span style={styles.totalValue}>Rs. {totalAmountToPay.toLocaleString()}</span>
            </div>
          </div>

          <div style={styles.secureNote}>
            <span style={styles.secureIcon}>🔒</span>
            <span style={styles.secureText}>
              Payments are encrypted and processed securely by eSewa
            </span>
          </div>

          <div style={styles.txnId}>
            TXN: {transactionUUID}
          </div>

          {isLoading ? (
            <button style={styles.loadingButton} disabled>
              Preparing payment…
            </button>
          ) : signature ? (
            <form
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
            >
              <input type="hidden" name="amount" value={amount} />
              <input type="hidden" name="tax_amount" value={taxAmount} />
              <input type="hidden" name="total_amount" value={totalAmountToPay} />
              <input type="hidden" name="transaction_uuid" value={transactionUUID} />
              <input type="hidden" name="product_code" value={productCode} />
              <input type="hidden" name="product_service_charge" value={productServiceCharge} />
              <input type="hidden" name="product_delivery_charge" value={productDeliveryCharge} />
              <input type="hidden" name="success_url" value="http://localhost:5173/success" />
              <input type="hidden" name="failure_url" value="http://localhost:5173/failure" />
              <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
              <input type="hidden" name="signature" value={signature} />
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <span>Pay Rs. {totalAmountToPay.toLocaleString()} with eSewa</span>
                <span>→</span>
              </button>
            </form>
          ) : (
            <button style={styles.loadingButton} disabled>
              Unable to initialize payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;