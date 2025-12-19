import React from "react";
import { ProductItem } from "../Items/ProductItem";
import type { GetProductRes } from "../../models";
import styles from "./ProductList.module.css";

type CartItem = {
  product: GetProductRes;
  quantity: number;
};

type ProductListProps = {
  products: GetProductRes[];
  cart: CartItem[];
  onAddToCart: (product: GetProductRes) => void;
  isLoading: boolean;
};

export const ProductList: React.FC<ProductListProps> = ({
  products,
  cart,
  onAddToCart,
  isLoading,
}) => {
  // Đảm bảo products luôn là một mảng
  const safeProducts = Array.isArray(products) ? products : [];

  if (isLoading) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #f3f4f6",
            borderTop: "3px solid #4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ fontSize: "16px", margin: 0 }}>Đang tải danh sách sản phẩm...</p>
        
      </div>
    );
  }

  if (safeProducts.length === 0) {
    return (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#f3f4f6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4"/>
            <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/>
            <line x1="9" y1="11" x2="15" y2="11"/>
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
          Chưa có sản phẩm nào
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: 0,
          }}
        >
          Các sản phẩm khả dụng sẽ xuất hiện ở đây
        </p>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100%",
        containerType: "inline-size", // Enable container queries
      }}
    >
      <div className={styles.productListContainer}>
        {safeProducts.map((product) => {
          const cartItem = cart.find((x) => x.product.id === product.id);

          return (
            <ProductItem
              key={product.id}
              product={product}
              selectedQuantity={cartItem?.quantity ?? 0}
              onAdd={() => onAddToCart(product as GetProductRes)}
            />
          );
        })}
      </div>
    </div>
  );
};


