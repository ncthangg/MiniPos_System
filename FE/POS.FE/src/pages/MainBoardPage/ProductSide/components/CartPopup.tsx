import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, X, Minus, Plus, Trash2, DollarSign } from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPopupProps {
  isOpen: boolean;
  cart: CartItem[];
  totalAmount: number;
  totalItems: number;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onClose: () => void;
  isCheckingOut?: boolean;
}

// Styles
const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 99998,
    backdropFilter: "blur(2px)",
  },
  popup: {
    position: "fixed" as const,
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "95%",
    maxWidth: "700px", // Tăng kích thước từ 600px lên 700px
    height: "min(650px, 85vh)", // Tăng height và responsive
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid #e5e7eb",
    zIndex: 99999,
    display: "flex" as const,
    flexDirection: "column" as const,
    overflow: "hidden" as const,
    // Smooth fade-in animation without position shift
    opacity: 1,
    transition: "opacity 0.2s ease-out"
  },
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#eef2ff",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    flexShrink: 0,
    height: "80px", // Fixed height cho header
    minHeight: "80px",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: "4px",
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  closeButton: {
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#374151",
    transition: "background-color 0.2s",
  },
  content: {
    flex: "1 1 0%",
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    padding: "16px",
    minHeight: 0, // Cho phép flex shrink
    maxHeight: "calc(650px - 80px - 100px)", // Total height - header - footer = 470px
    scrollbarWidth: "thin" as const,
    scrollbarColor: "#cbd5e1 #f1f5f9",
  },
  emptyState: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: "48px 0",
  },
  emptyIcon: {
    color: "#d1d5db",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: "500" as const,
    color: "#374151",
    marginBottom: "4px",
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  itemsList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "12px",
  },
  item: {
    display: "flex" as const,
    flexDirection: "column" as const,
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    transition: "box-shadow 0.2s",
  },
  itemInfo: {
    width: "100%",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: "8px",
  },
  itemDetails: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    marginBottom: "12px",
  },
  itemPrice: {
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#374151",
  },
  itemId: {
    fontSize: "12px",
    color: "#6b7280",
  },
  quantityControls: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "4px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
  quantityButton: {
    padding: "8px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#374151",
    transition: "background-color 0.2s",
    borderRadius: "6px",
  },
  quantityValue: {
    minWidth: "40px",
    textAlign: "center" as const,
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#111827",
    padding: "8px 12px",
    borderLeft: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
  },
  itemTotal: {
    fontSize: "16px",
    fontWeight: "700" as const,
    color: "#4f46e5",
  },
  removeButton: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "4px",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500" as const,
    color: "#dc2626",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  footer: {
    padding: "20px 24px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    flexShrink: 0,
    height: "100px", // Fixed height cho footer
    minHeight: "100px",
  },
  totalLabel: {
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#6b7280",
    marginBottom: "4px",
  },
  totalAmount: {
    fontSize: "24px",
    fontWeight: "700" as const,
    color: "#4f46e5",
  },
  checkoutButton: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    padding: "12px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600" as const,
    color: "white",
    backgroundColor: "#4f46e5",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
  },
  // Custom scrollbar styles
  scrollableContent: {
    flex: "1 1 0%",
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    padding: "16px",
    minHeight: 0,
    maxHeight: "calc(650px - 80px - 100px)", // 470px content area
  },
};

export const CartPopup: React.FC<CartPopupProps> = ({
  isOpen,
  cart,
  totalAmount,
  totalItems,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  onClose,
  isCheckingOut = false,
}) => {
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = (): void => {
    onCheckout();
    onClose();
  };

  const handleOverlayClick = (): void => {
    onClose();
  };

  const handlePopupClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  const handleQuantityDecrease = (productId: string): void => {
    onDecrease(productId);
  };

  const handleQuantityIncrease = (productId: string): void => {
    onIncrease(productId);
  };

  const handleRemoveItem = (productId: string): void => {
    onRemove(productId);
  };

  const popupContent = (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={handleOverlayClick} />

      {/* Popup */}
      <div style={styles.popup} onClick={handlePopupClick}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h3 style={styles.headerTitle}>Giỏ hàng</h3>
            <p style={styles.headerSubtitle}>
              {totalItems} {totalItems === 1 ? "sản phẩm" : "sản phẩm"}
            </p>
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "white";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable Area */}
        <div
          style={styles.scrollableContent}
          className="cart-popup-content"
        >
          {cart.length === 0 ? (
            // Empty state
            <div style={styles.emptyState}>
              <ShoppingCart size={64} style={styles.emptyIcon} />
              <p style={styles.emptyTitle}>Giỏ hàng trống</p>
              <p style={styles.emptySubtitle}>Thêm sản phẩm vào giỏ để bắt đầu</p>
            </div>
          ) : (
            // Items list
            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={styles.item}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Product Info */}
                  <div style={styles.itemInfo}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={styles.itemName}>{item.product.name}</p>
                        <div style={styles.itemDetails}>
                          <span style={styles.itemPrice}>
                            Đơn giá: {item.product.price.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </div>

                      {/* Remove Button - Góc trên phải */}
                      <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveItem(item.product.id)}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = "#fef2f2";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Xóa</span>
                      </button>
                    </div>

                    {/* Quantity controls và Thành tiền - Cùng hàng */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "12px"
                    }}>
                      {/* Quantity controls */}
                      <div style={styles.quantityControls}>
                        <button
                          style={styles.quantityButton}
                          onClick={() => handleQuantityDecrease(item.product.id)}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "white";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={styles.quantityValue}>{item.quantity}</span>
                        <button
                          style={styles.quantityButton}
                          onClick={() => handleQuantityIncrease(item.product.id)}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "white";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Thành tiền */}
                      <div style={styles.itemTotal}>
                        Thành tiền: {(item.product.price * item.quantity).toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div>
              <p style={styles.totalLabel}>Tổng cộng</p>
              <p style={styles.totalAmount}>{totalAmount.toLocaleString("vi-VN")} đ</p>
            </div>
            <button
              style={styles.checkoutButton}
              onClick={handleCheckout}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = "scale(1.02)";
                (e.target as HTMLElement).style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "scale(1)";
                (e.target as HTMLElement).style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
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
        )}
      </div>
    </>
  );

  // Render to body using Portal
  return createPortal(popupContent, document.body);
};