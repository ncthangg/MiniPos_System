import type { PostOrderReq } from "../models";
import { END_POINT } from "../models/endpoints";
import { defaultAxiosInstance } from "./axiosIntance";

class APIService {  

    GetProducts = async () => {
        return await defaultAxiosInstance.get(END_POINT.PRODUCT.GetAll);
    }

    PostOrder = async (postOrderReq: PostOrderReq) => {
        return await defaultAxiosInstance.post(END_POINT.ORDER.Post, postOrderReq);
    }

    GetOrders = async (pageNumber: number, pageSize: number, softField?: string, sortDirection?: string, searchValue?: string ) => {
        return await defaultAxiosInstance.get(END_POINT.ORDER.GetAll, {
            params: {
                pageNumber,
                pageSize,
                softField,
                sortDirection,
                searchValue
            }
        });
    }

    GetOrderById = async (orderId: string) => {
        return await defaultAxiosInstance.get(END_POINT.ORDER.GetById(orderId));
    }

}

const apiService = new APIService();
export default apiService;
