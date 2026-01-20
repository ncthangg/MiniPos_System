import React, { useState, useRef, useEffect } from "react";
import { OrderItem } from "../Items/OrderItem";
import type { GetOrderRes } from "../../models";
import type { OrderFilters, OrderPagination } from "../../models";
import theme from "../../styles/theme";

type OrderListProps = {
  orders: GetOrderRes[];
  onViewDetails?: (orderId: string) => void;
  isLoading?: boolean;
  orderPagination: OrderPagination;
  orderFilters: OrderFilters;
  handlePageChange: (page: number, newPageSize?: number) => void;
  handleSearchOrders: (searchValue: string) => void;
  isLoadingOrders: boolean;
};

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewDetails,
  isLoading = false,
  orderPagination,
  orderFilters,
  handlePageChange,
  handleSearchOrders,
  isLoadingOrders,
}) => {
  const [searchInput, setSearchInput] = useState(orderFilters.searchValue);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasFocusedRef = useRef(false);

  // Sync searchInput with orderFilters.searchValue only when it changes externally (not from user input)
  useEffect(() => {
    // Only update if the change comes from external source (not from user typing)
    if (!isUserTypingRef.current && orderFilters.searchValue !== searchInput) {
      setSearchInput(orderFilters.searchValue);
    }
    // Reset the flag after processing
    isUserTypingRef.current = false;
  }, [orderFilters.searchValue]);

  // Restore focus after re-render if input was focused before
  useEffect(() => {
    if (wasFocusedRef.current && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      // Restore cursor position to the end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [orders, isLoadingOrders]);

  //#region render 
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
        <p style={{ fontSize: "16px", margin: 0 }}>Đang tải danh sách đơn hàng...</p>
        
      </div>
    );
  }
  //#endregion

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Search Bar */}
      <div style={{ 
        padding: "16px 20px", 
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb"
      }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            
            // Mark that user is typing to prevent external sync
            isUserTypingRef.current = true;
            setSearchInput(value);
            
            // Clear previous timeout
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
            
            // Set new timeout for debounced search
            searchTimeoutRef.current = setTimeout(() => {
              handleSearchOrders(value);
            }, 500);
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => {
            wasFocusedRef.current = true;
            e.target.style.borderColor = "#3b82f6";
          }}
          onBlur={(e) => {
            wasFocusedRef.current = false;
            e.target.style.borderColor = "#d1d5db";
          }}
        />
      </div>
      
      {/* Orders List */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto",
        overflowX: "hidden",
        padding: "20px",
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #f1f5f9"
      }}>
        {/* Empty State */}
        {orders.length === 0 && !isLoading ? (
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
              {orderFilters.searchValue ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng nào"}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: 0,
              }}
            >
              {orderFilters.searchValue 
                ? `Không có đơn hàng nào khớp với "${orderFilters.searchValue}"`
                : "Các đơn hàng sẽ xuất hiện ở đây khi có giao dịch"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Render Orders - Data already sorted and paginated from server */}
            {orders.map((order, index) => (
              <OrderItem
                key={`${order.id}-${index}`}
                order={order}
                onViewDetails={onViewDetails}
              />
            ))}
            
            {/* Load More Button - Only show for Load More functionality */}
            {orderPagination.totalPages > orderPagination.currentPage && (
              <div style={{ 
                textAlign: "center", 
                padding: "20px",
                borderTop: "1px solid #f3f4f6",
                marginTop: "16px"
              }}>
                <button
                  onClick={() => handlePageChange(orderPagination.currentPage + 1)}
                  disabled={isLoadingOrders}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isLoadingOrders ? "#9ca3af" : theme.colors.brand[600],
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isLoadingOrders ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "0 auto"
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoadingOrders) {
                      (e.target as HTMLElement).style.backgroundColor = theme.colors.brand[700];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoadingOrders) {
                      (e.target as HTMLElement).style.backgroundColor = theme.colors.brand[600];
                    }
                  }}
                >
                  {isLoadingOrders && (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid #ffffff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}
                    />
                  )}
                  {isLoadingOrders 
                    ? "Đang tải..." 
                    : `Tải thêm (${Math.max(0, orderPagination.totalItems - orders.length)} còn lại)`
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Ant Design Style Pagination */}
      <div style={{
        padding: "16px 0",
        borderTop: "1px solid #f0f0f0",
        backgroundColor: theme.colors.surface.base,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          color: "rgba(0, 0, 0, 0.85)"
        }}>

          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(orderPagination.currentPage - 1)}
            disabled={orderPagination.currentPage === 1 || isLoadingOrders}
            style={{
              minWidth: "80px",
              height: "36px",
              padding: "0 16px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              backgroundColor: (orderPagination.currentPage === 1 || isLoadingOrders) ? "#f5f5f5" : "white",
              color: (orderPagination.currentPage === 1 || isLoadingOrders) ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.65)",
              cursor: (orderPagination.currentPage === 1 || isLoadingOrders) ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (orderPagination.currentPage > 1 && !isLoadingOrders) {
                (e.target as HTMLElement).style.borderColor = "#4096ff";
                (e.target as HTMLElement).style.color = "#4096ff";
              }
            }}
            onMouseLeave={(e) => {
              if (orderPagination.currentPage > 1 && !isLoadingOrders) {
                (e.target as HTMLElement).style.borderColor = "#d9d9d9";
                (e.target as HTMLElement).style.color = "rgba(0, 0, 0, 0.65)";
              }
            }}
          >
            ‹ Trước
          </button>

          {/* Page Input */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            color: "rgba(0, 0, 0, 0.65)"
          }}>
            <span>Trang</span>
            <input
              type="number"
              min={1}
              max={orderPagination.totalPages}
              value={orderPagination.currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= orderPagination.totalPages) {
                  handlePageChange(page);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt((e.target as HTMLInputElement).value);
                  if (page >= 1 && page <= orderPagination.totalPages) {
                    handlePageChange(page);
                  }
                }
              }}
              style={{
                width: "60px",
                height: "36px",
                padding: "0 8px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "14px",
                backgroundColor: "white",
                outline: "none"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#4096ff";
                e.target.style.boxShadow = "0 0 0 2px rgba(64, 150, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d9d9d9";
                e.target.style.boxShadow = "none";
              }}
            />
            <span>/ {orderPagination.totalPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(orderPagination.currentPage + 1)}
            disabled={orderPagination.currentPage === orderPagination.totalPages || isLoadingOrders}
            style={{
              minWidth: "80px",
              height: "36px",
              padding: "0 16px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              backgroundColor: (orderPagination.currentPage === orderPagination.totalPages || isLoadingOrders) ? "#f5f5f5" : "white",
              color: (orderPagination.currentPage === orderPagination.totalPages || isLoadingOrders) ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.65)",
              cursor: (orderPagination.currentPage === orderPagination.totalPages || isLoadingOrders) ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (orderPagination.currentPage < orderPagination.totalPages && !isLoadingOrders) {
                (e.target as HTMLElement).style.borderColor = "#4096ff";
                (e.target as HTMLElement).style.color = "#4096ff";
              }
            }}
            onMouseLeave={(e) => {
              if (orderPagination.currentPage < orderPagination.totalPages && !isLoadingOrders) {
                (e.target as HTMLElement).style.borderColor = "#d9d9d9";
                (e.target as HTMLElement).style.color = "rgba(0, 0, 0, 0.65)";
              }
            }}
          >
            Sau ›
          </button>

        </div>
      </div>
      
      {/* Global CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};