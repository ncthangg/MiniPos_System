import React, { useMemo, useState } from "react";
import { ProductList } from "../../../components/Lists/ProductList";
import theme from "../../../styles/theme";
import type { GetProductRes, PostOrderReq } from "../../../models";
import { Cart } from "./components/Cart";
import apiService from "../../../services/api";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

type CartItem = {
  product: GetProductRes;
  quantity: number;
};

type ProductSideProps = {
  products: GetProductRes[];
  isLoading: boolean;
  error: string | null;
};

export const ProductSide: React.FC<ProductSideProps> = ({ products, isLoading, error }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  //#region handle function
  const handleAddToCart = (product: GetProductRes) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.product.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.product.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleIncrease = (productId: string) => {
    setCart((prev) =>
      prev.map((x) =>
        x.product.id === productId ? { ...x, quantity: x.quantity + 1 } : x
      )
    );
  };

  const handleDecrease = (productId: string) => {
    setCart((prev) =>
      prev
        .map((x) =>
          x.product.id === productId
            ? { ...x, quantity: Math.max(0, x.quantity - 1) }
            : x
        )
        .filter((x) => x.quantity > 0)
    );
  };

  const handleRemove = (productId: string) => {
    setCart((prev) => prev.filter((x) => x.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      setShowConfirmModal(false);
      setIsCheckingOut(true);

      // Tạo order request từ cart
      const orderRequest: PostOrderReq = {
        totalAmount: totalAmount,
        totalItem: totalItems,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      await apiService.PostOrder(orderRequest);
      setCart([]);

    } catch (error: any) {
      // ... existing error handling
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelCheckout = () => {
    setShowConfirmModal(false);
  };
  //#endregion

  //#region utils
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );
  //#endregion

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.base,
        borderRadius: theme.sizes.radius.xl,
        boxShadow: theme.sizes.shadow.md,
        border: `1px solid ${theme.colors.border.subtle}`,
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header - Fixed height */}
      <div
        style={{
          borderBottom: `4px solid ${theme.colors.border.subtle}`,
          backgroundColor: theme.colors.surface.muted,
          flexShrink: 0,
          height: "80px",
          minHeight: "80px",
          maxHeight: "80px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div>
          <h2
            className="text-heading-2"
            style={{
              marginBottom: theme.sizes.spacing.xs,
              fontSize: "clamp(1.25rem, 2vw, 1.5rem)", // Responsive font size
            }}
          >
            Danh sách các sản phẩm
          </h2>
        </div>
      </div>

      {/* Product list - Flexible middle section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {error ? (
          // Error State
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#fef2f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#374151",
                margin: "0 0 8px 0",
              }}
            >
              Có lỗi xảy ra
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 20px 0",
              }}
            >
              {error}
            </p>
          </div>
        ) : (
          // Product List
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            cart={cart}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Cart - Fixed at bottom */}
      <div
        style={{
          flexShrink: 0,
          minHeight: "fit-content",
          maxHeight: "40vh", // Giới hạn chiều cao tối đa của cart
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Cart
          cart={cart}
          totalAmount={totalAmount}
          totalItems={totalItems}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          isCheckingOut={isCheckingOut}
        />
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Xác nhận thanh toán"
        saveText="Thanh toán ngay"
        cancelText="Hủy"
        onSave={handleConfirmCheckout}
        onCancel={handleCancelCheckout}
        saveColor={theme.colors.state.success}
        cancelColor={theme.colors.state.error}
      >

        <div style={{ marginBottom: "16px" }}>
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "8px"
          }}>
            <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
              Tổng tiền: {totalAmount.toLocaleString("vi-VN")} đ
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              Số lượng: {totalItems} món
            </p>
          </div>

          {/* Optional: Show cart items */}
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {cart.map((item, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "2px 0"
              }}>
                <span>{item.product.name} x{item.quantity}</span>
                <span>{(item.product.price * item.quantity).toLocaleString("vi-VN")} đ</span>
              </div>
            ))}
          </div>
        </div>

      </ConfirmModal>
    </div>
  );
};
