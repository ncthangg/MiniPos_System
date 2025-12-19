import React, { useState } from "react";
import { ShoppingCart, DollarSign } from "lucide-react";
import type { GetProductRes } from "../../../../models";
import { CartPopup } from "./CartPopup";

type CartItem = {
  product: GetProductRes;
  quantity: number;
};

type CartProps = {
  cart: CartItem[];
  totalAmount: number;
  totalItems: number;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  isCheckingOut?: boolean;
};

export const Cart: React.FC<CartProps> = ({
  cart,
  totalAmount,
  totalItems,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  isCheckingOut = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Cart Bar - Đồng bộ với CartPopup style */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto", // 3 cột đều nhau
          alignItems: "center",
          backgroundColor: "#f9fafb", // Đồng bộ với CartPopup footer
          padding: "20px 24px", // Đồng bộ với CartPopup
          borderTop: "1px solid #e5e7eb", // Đồng bộ với CartPopup
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
          gap: "16px",
        }}
      >
        {/* Cột 1: Cart Icon Button - Căn trái */}
        <div className="flex justify-start">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{
              width: "48px", // Đồng bộ với CartPopup button size
              height: "48px",
              backgroundColor: "#4f46e5", // Đồng bộ với CartPopup
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
          >
            {/* Badge số lượng items ở góc trên */}
            {totalItems > 0 && (
              <div
                className="absolute -top-2 -right-2 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  backgroundColor: "#dc2626", // Đồng bộ với CartPopup
                  borderRadius: "10px",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 4px",
                  boxShadow: "0 2px 4px rgba(220, 38, 38, 0.3)",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </div>
            )}
            <ShoppingCart size={20} color="white" strokeWidth={2} />
          </button>
        </div>

        {/* Cột 2: Số tiền - Căn giữa */}
        <div className="flex justify-center">
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#6b7280", // Đồng bộ với CartPopup totalLabel
              marginBottom: "4px",
              margin: 0,
            }}>
              Tổng cộng
            </p>
            <p style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#4f46e5", // Đồng bộ với CartPopup totalAmount
              margin: 0,
            }}>
              {totalAmount.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>

        {/* Cột 3: Checkout Button - Căn phải */}
        <div className="flex justify-end">
          <button
            onClick={onCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="inline-flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (cart.length === 0 || isCheckingOut) ? "#94a3b8" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: (cart.length === 0 || isCheckingOut) ? "not-allowed" : "pointer",
              boxShadow: (cart.length === 0 || isCheckingOut) ? "none" : "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (cart.length > 0 && !isCheckingOut) {
                (e.target as HTMLElement).style.transform = "scale(1.02)";
                (e.target as HTMLElement).style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (cart.length > 0 && !isCheckingOut) {
                (e.target as HTMLElement).style.transform = "scale(1)";
                (e.target as HTMLElement).style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
              }
            }}
          >
            {isCheckingOut ? (
              <>
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>Thanh toán</span>
                <DollarSign size={18} />
              </>
            )}
          </button>
          
        </div>
      </div>

      {/* Cart Popup - Rendered via Portal, independent of layout */}
      <CartPopup
        isOpen={isOpen}
        cart={cart}
        totalAmount={totalAmount}
        totalItems={totalItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
        onCheckout={onCheckout}
        onClose={() => setIsOpen(false)}
        isCheckingOut={isCheckingOut}
      />
    </>
  );
};
