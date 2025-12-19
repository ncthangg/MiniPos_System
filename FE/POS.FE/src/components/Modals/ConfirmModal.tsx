import type { ReactNode } from "react";
import Button from "../UICustoms/Button";
import theme from "../../styles/theme";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    cancelText?: string;
    onCancel: () => void;
    saveText?: string;
    onSave: () => void;
    saveColor?: string;     // màu nút lưu
    cancelColor?: string; // màu nút tiếp tục
    children?: ReactNode;   // nội dung tuỳ chỉnh thêm
}

export default function ConfirmModal({
    open,
    title = "Chỉnh sửa chưa được lưu",
    message = "Bạn có muốn bỏ các thay đổi và rời trang, hay tiếp tục chỉnh sửa?",
    cancelText = "Hủy",
    onCancel,
    saveText = "Bỏ thay đổi và rời trang",
    onSave,
    children,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
            <div style={{
                position: "relative",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}>
                <h3 style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px"
                }}>
                    {title}
                </h3>
                {message && (
                    <p style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "16px"
                    }}>
                        {message}
                    </p>
                )}
                {children}

                {/* Buttons */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "8px"
                }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: theme.colors.state.error,
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: theme.colors.state.success,
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        {saveText}
                    </button>
                </div>
            </div>
        </div>
        //
    );
}
