import React from "react";
import type { GetOrderRes } from "../../models";

type OrderItemProps = {
  order: GetOrderRes;
  onViewDetails?: (orderId: string) => void;
};

export const OrderItem: React.FC<OrderItemProps> = ({ 
  order, 
  onViewDetails 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "#10b981"; // green
      case "pending":
        return "#f59e0b"; // yellow
      case "failed":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "Thành công";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "16px",
        marginBottom: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease",
        cursor: onViewDetails ? "pointer" : "default",
      }}
      onClick={() => onViewDetails?.(order.id)}
      onMouseEnter={(e) => {
        if (onViewDetails) {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (onViewDetails) {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        {/* Order ID và thời gian */}
        <div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
              marginBottom: "4px",
            }}
          >
            #{order.id}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            Thời gian: {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Status Badge */}
        <div
          style={{
            backgroundColor: getStatusColor(order.orderStatus),
            color: "white",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {getStatusText(order.orderStatus)}
        </div>
      </div>

      {/* Order Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Items info */}
        <div>
          <p
            style={{
              fontSize: "14px",
              color: "#374151",
              margin: 0,
              marginBottom: "4px",
            }}
          >
            Số lượng: <span style={{ fontWeight: "600" }}>{order.totalItem || 0}</span>
          </p>
          
        </div>

        {/* Total Amount */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: 0,
              marginBottom: "2px",
            }}
          >
            Tổng tiền
          </p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#4f46e5",
              margin: 0,
            }}
          >
            {order.totalAmount.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>

      {/* View Details Indicator */}
      {onViewDetails && (
        <div
          style={{
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #f3f4f6",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontStyle: "italic",
            }}
          >
            Click để xem chi tiết →
          </span>
        </div>
      )}
    </div>
  );
};