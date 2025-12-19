export interface ApiSuccessResponse<T> {
    data: T;
    additionalData: any;
    message: string | null;
    statusCode: number;
    code: string;
}

export interface CustomErrorResponse {
    error: any;
    errorCode: string;
    errorMessage: string;
}

export interface AspNetValidationErrorResponse {
    type: string;
    title: string;
    status: number;
    errors: Record<string, string[]>;
    traceId: string;
}

export interface OrderPagination {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
  
  export interface OrderFilters {
    sortField: string;
    sortDirection: "asc" | "desc";
    searchValue: string;
  }
//=================================================

export interface PostOrderReq {
    totalAmount: number;
    totalItem: number;
    items: PostOrderItemReq[];
}

export interface PostOrderItemReq {
    productId: string;
    quantity: number;
}

//=================================================
export interface GetProductRes{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;

    createdAt: string;
    createdBy: string;

    updatedAt: string;
    updatedBy: string;

    deletedAt: string;
    deletedBy: string;
    status: boolean;
}

export interface GetOrderRes {
    id: string;
    totalAmount: number;
    totalItem: number;
    orderStatus: string;

    items?: GetOrderItemsRes[];

    createdAt: string;
    createdBy: string;

    updatedAt: string;
    updatedBy: string;

    deletedAt: string;
    deletedBy: string;
    status: boolean;
}

export interface GetOrderItemsRes{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;

    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
    status: boolean;
}

