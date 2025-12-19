import { useEffect, useMemo, useState } from "react";
import { MainBoardLayout } from "../../layouts/MainBoardLayout";
import type { GetOrderRes, GetProductRes, OrderFilters, OrderPagination } from "../../models";
import { OrderSide } from "./OrderSide";
import { ProductSide } from "./ProductSide";
import apiService from "../../services/api";
import { useSignalRGroups } from "../../hooks/useSignalRGroup";

export default function MainBoardPage() {
  const [errorLoadingProducts, setErrorLoadingProducts] = useState<string | null>(null);
  const [errorLoadingOrders, setErrorLoadingOrders] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [products, setProducts] = useState<GetProductRes[]>([]);
  const [orders, setOrders] = useState<GetOrderRes[]>([]);

  const [orderPagination, setOrderPagination] = useState<OrderPagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [orderFilters, setOrderFilters] = useState<OrderFilters>({
    sortField: "createdAt",
    sortDirection: "desc" as "asc" | "desc",
    searchValue: ""
  });

  //#region useEffect
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);
  //#endregion

  //#region handle load more orders
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await apiService.GetProducts();
      const productsData = response.data?.data || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setErrorLoadingProducts(error.response.data.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchOrders = async (page: number = 1, resetData: boolean = false, customFilters?: Partial<OrderFilters>) => {
    try {
      setIsLoadingOrders(true);
      
      const filters = customFilters ? { ...orderFilters, ...customFilters } : orderFilters;
      
      const response = await apiService.GetOrders(
        page,
        orderPagination.pageSize,
        filters.sortField,
        filters.sortDirection,
        filters.searchValue
      );

      const orderData = response.data?.data.list || response.data.data.list || [];
      const pagination = response.data?.data || {};

      setOrders(prev => {
        if (resetData) {
          return orderData;
        } else {
          const existingIds = new Set(prev.map(order => order.id));
          const newOrders = orderData.filter((order: GetOrderRes) => !existingIds.has(order.id));
          return [...prev, ...newOrders];
        }
      });

      setOrderPagination({
        currentPage: pagination.currentPage || page,
        pageSize: pagination.pageSize || 10,
        totalItems: pagination.totalItems || 0,
        totalPages: pagination.totalPages || 0,
      });

    } catch (error: any) {
      setOrders([]);
      setErrorLoadingOrders(error.response?.data?.message || "Lỗi tải đơn hàng");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== orderPagination.pageSize) {
      // Update page size and reset to page 1
      setOrderPagination(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
      fetchOrders(1, true);
    } else {
      fetchOrders(page, true);
    }
  };

  const handleSearchOrders = (searchValue: string) => {
    setOrderFilters(prev => ({ ...prev, searchValue }));
    setOrderPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchOrders(1, true, { searchValue });
  };
  //#endregion

  //#region signalR
  const handlersList = useMemo(() => [
    {
      group: "page:order:list",
      handlers: {
        OrderCreated: (order: GetOrderRes) => {
          setOrders(prev => {
            if (prev.some(o => o.id === order.id)) return prev;
            return [order, ...prev];
          });
        },
      }
    }
  ], []); // Loại bỏ dependency để tránh tái tạo handlers

  const { isConnected: isSignalRConnected } = useSignalRGroups(handlersList);
  //#endregion

  return (
    <MainBoardLayout
      left={<ProductSide products={products} isLoading={isLoadingProducts} error={errorLoadingProducts} />}
      right={<OrderSide
        orders={orders}
        isLoading={isLoadingOrders}
        error={errorLoadingOrders}
        isSignalRConnected={isSignalRConnected}
        orderPagination={orderPagination}
        orderFilters={orderFilters}
        handlePageChange={handlePageChange}
        handleSearchOrders={handleSearchOrders}
        isLoadingOrders={isLoadingOrders}
      />}
    />
  );
}