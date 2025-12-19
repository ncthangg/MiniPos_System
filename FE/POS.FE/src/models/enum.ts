export const OrderStatusType = {
    peding: "peding",
    success: "success",
    fail: "fail",
} as const;
export type OrderStatusType = (typeof OrderStatusType)[keyof typeof OrderStatusType];