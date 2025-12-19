import React, { useState } from "react";
import { OrderList } from "../../../components/Lists/OrderList";
import { OrderDetail } from "../../../components/Modals/OrderDetail";
import theme from "../../../styles/theme";
import type { GetOrderRes } from "../../../models";
import type { OrderFilters, OrderPagination } from "../../../models";

type OrderSideProps = {
  orders: GetOrderRes[];
  isLoading: boolean;
  error: string | null;
  isSignalRConnected: boolean;
  orderPagination: OrderPagination;
  orderFilters: OrderFilters;
  handlePageChange: (page: number, newPageSize?: number) => void;
  handleSearchOrders: (searchValue: string) => void;
  isLoadingOrders: boolean;
};

export const OrderSide: React.FC<OrderSideProps> = ({ 
  orders, 
  isLoading, 
  error, 
  isSignalRConnected,
  orderPagination,
  orderFilters,
  handlePageChange,
  handleSearchOrders,
  isLoadingOrders,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  //#region handle function
  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(null);
  };
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
      {/* Header */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h2
              className="text-heading-2"
              style={{
                fontSize: "clamp(1.25rem, 2vw, 1.5rem)", 
                margin: 0,
              }}
            >
              Đơn hàng
            </h2>
            
            {/* SignalR Connection Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: isSignalRConnected ? "#dcfce7" : "#fef2f2",
                border: `1px solid ${isSignalRConnected ? "#16a34a" : "#ef4444"}`,
                borderRadius: "12px",
                padding: "2px 8px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: isSignalRConnected ? "#16a34a" : "#ef4444",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: isSignalRConnected ? "#16a34a" : "#ef4444",
                  textTransform: "uppercase",
                }}
              >
                {isSignalRConnected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
          </div>
          
          <p
            style={{
              fontSize: "14px",
              color: theme.colors.text.subtle,
              margin: 0,
            }}
          >
            Tổng cộng {orderPagination.totalItems} đơn hàng
          </p>
        </div>
      </div>

      {/* Content Area */}
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
          // Order List
          <OrderList
            orders={orders}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            orderPagination={orderPagination}
            orderFilters={orderFilters}
            handlePageChange={handlePageChange}
            handleSearchOrders={handleSearchOrders}
            isLoadingOrders={isLoadingOrders}
          />
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetail
        isOpen={isDetailModalOpen}
        orderId={selectedOrderId}
        onClose={handleCloseDetail}
      />
    </div>
  );
};
