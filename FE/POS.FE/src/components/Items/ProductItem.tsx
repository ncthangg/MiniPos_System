import React from "react";
import theme from "../../styles/theme";
import type { GetProductRes } from "../../models";
import styles from "./ProductItem.module.css";

type ProductItemProps = {
  product: GetProductRes;
  selectedQuantity?: number;
  onAdd: () => void;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  selectedQuantity = 0,
  onAdd,
}) => {
  const isSelected = selectedQuantity > 0;
  
  return (
    <div
      className={`${styles.productItem} ${isSelected ? styles.selected : ""}`}
      style={{
        border: isSelected
          ? `2px solid ${theme.colors.brand[600]}`
          : "1px solid #e5e7eb",
      }}
    >
      {/* Image Area */}
      <div className={styles.imageArea}>
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg
              style={{
                width: "clamp(1rem, 2.5vw, 1.5rem)",
                height: "clamp(1rem, 2.5vw, 1.5rem)",
              }}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {isSelected && (
          <div
            className={styles.quantityBadge}
            style={{ backgroundColor: theme.colors.brand[600] }}
          >
            x{selectedQuantity}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {/* Product Name */}
        <h3 className={styles.productName}>
          {product.name}
        </h3>

        {/* Price and Button Container */}
        <div className={styles.priceButtonContainer}>
          {/* Price */}
          <span className={styles.price}>
            ${product.price}
          </span>

          {/* Add to Cart Button */}
          <button
            onClick={onAdd}
            className={styles.addButton}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};


