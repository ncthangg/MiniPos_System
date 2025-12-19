import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Clock, User, DollarSign } from "lucide-react";
import type { GetOrderRes, GetOrderItemsRes } from "../../models";
import apiService from "../../services/api";

interface OrderDetailProps {
    isOpen: boolean;
    orderId: string | null;
    onClose: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
    isOpen,
    orderId,
    onClose,
}) => {
    const [orderDetail, setOrderDetail] = useState<GetOrderRes | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //#region useEffect
    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetail();
        }
    }, [isOpen, orderId]);

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
    //#endregion
    
    //#region functions

    const fetchOrderDetail = async () => {
        if (!orderId) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await apiService.GetOrderById(orderId);

            const orderData = response.data?.data || response.data;
            setOrderDetail(orderData);

        } catch (error: any) {
            console.error("Error fetching order detail:", error);
            setError("Không thể tải chi tiết đơn hàng");
            setOrderDetail(null);
        } finally {
            setIsLoading(false);
        }
    };
    //#endregion

    //#region helpers
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };
    //#endregion

    //#region event handlers
    const handleOverlayClick = () => {
        onClose();
    };
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    //#endregion

    //#region render components
    if (!isOpen) return null;
    //#endregion

    const modalContent = (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 99998,
                    backdropFilter: "blur(2px)",
                }}
                onClick={handleOverlayClick}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: "700px",
                    maxHeight: "90vh",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    border: "1px solid #e5e7eb",
                    zIndex: 99999,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
                onClick={handleModalClick}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "24px",
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#111827",
                                margin: 0,
                                marginBottom: "4px",
                            }}
                        >
                            Chi tiết đơn hàng
                        </h2>
                        {orderDetail && (
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: 0,
                                }}
                            >
                                #{orderDetail.id}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#374151",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "#f3f4f6";
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "24px",
                    }}
                >
                    {isLoading ? (
                        // Loading State
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "60px 0",
                                flexDirection: "column",
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
                                    marginBottom: "16px",
                                }}
                            />
                            <p style={{ color: "#6b7280", margin: 0 }}>Đang tải chi tiết...</p>

                        </div>
                    ) : error ? (
                        // Error State
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "60px 0",
                                flexDirection: "column",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#fef2f2",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "16px",
                                }}
                            >
                                <X size={24} color="#ef4444" />
                            </div>
                            <h3
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                Không thể tải dữ liệu
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
                            <button
                                onClick={fetchOrderDetail}
                                style={{
                                    backgroundColor: "#4f46e5",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px 24px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                }}
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : orderDetail ? (
                        // Order Details
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {/* Order Summary */}
                            <div
                                style={{
                                    backgroundColor: "#f8fafc",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#111827",
                                        margin: "0 0 16px 0",
                                    }}
                                >
                                    Thông tin đơn hàng
                                </h3>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                                    {/* Total Amount */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                backgroundColor: "#4f46e5",
                                                borderRadius: "8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <DollarSign size={20} color="white" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Tổng tiền</p>
                                            <p style={{ fontSize: "18px", fontWeight: "700", color: "#4f46e5", margin: 0 }}>
                                                {orderDetail.totalAmount.toLocaleString("vi-VN")} đ
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                backgroundColor: "#10b981",
                                                borderRadius: "8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Clock size={20} color="white" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Thời gian thanh toán</p>
                                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>
                                                {formatDate(orderDetail.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created By */}
                                    {orderDetail.createdBy && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    backgroundColor: "#f59e0b",
                                                    borderRadius: "8px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <User size={20} color="white" />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Người tạo</p>
                                                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>
                                                    {orderDetail.createdBy}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            {orderDetail.items && orderDetail.items.length > 0 && (
                                <div>
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#111827",
                                            margin: "0 0 16px 0",
                                        }}
                                    >
                                        Chi tiết sản phẩm ({orderDetail.items.length} món)
                                    </h3>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {orderDetail.items.map((item: GetOrderItemsRes, index: number) => (
                                            <div
                                                key={item.id || `item-${index}`}
                                                style={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    padding: "16px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div>
                                                    <p
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            color: "#111827",
                                                            margin: "0 0 4px 0",
                                                        }}
                                                    >
                                                        {item.name}
                                                    </p>
                                                </div>

                                                <div style={{ textAlign: "right" }}>
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#6b7280",
                                                            margin: "0 0 4px 0",
                                                        }}
                                                    >
                                                        {item.quantity} x {item.unitPrice.toLocaleString("vi-VN")} đ
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "700",
                                                            color: "#4f46e5",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {(item.quantity * item.unitPrice).toLocaleString("vi-VN")} đ
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );

    return createPortal(modalContent, document.body);
};