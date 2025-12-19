import { toast } from "react-toastify";
import config from "../config/config";
import type { AspNetValidationErrorResponse, CustomErrorResponse } from "../models";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const DEFAULT_ERROR_MSG = "Lỗi không xác định từ máy chủ!";

/**
 * Loading state handler (set globally)
 */
let setLoading: (loading: boolean) => void = () => {};
export const setGlobalLoadingHandler = (
  loadingHandler: (loading: boolean) => void
) => {
  setLoading = loadingHandler;
};

// Default axios instance used for requests not requiring token authorization
const defaultAxiosInstance: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 300000,
  timeoutErrorMessage: "Connection timeout exceeded",
});

/**
 * Setup interceptors for defaultAxiosInstance
 */
function setupDefaultInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      setLoading(true);
      return config;
    },
    (error) => {
      setLoading(false);
      return handleErrorResponse(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      setLoading(false);
      const apiMessage = response.data?.message;
      if (apiMessage) toast.success(apiMessage);
      return response;
    },
    (error) => {
      setLoading(false);
      return handleErrorResponse(error);
    }
  );
}


// Setup interceptors
setupDefaultInterceptors(defaultAxiosInstance);

/**
 * Type guards for custom error types
 */
function isCustomErrorResponse(data: any): data is CustomErrorResponse {
  return (
    typeof data?.errorMessage === "string" &&
    typeof data?.errorCode === "string"
  );
}

function isAspNetValidationError(
  data: any
): data is AspNetValidationErrorResponse {
  return typeof data?.title === "string" && typeof data?.errors === "object";
}

/**
 * Helper: Extract meaningful error message from API response or fallback
 */
function extractErrorMessage(
  data: any,
  fallbackMessage: string = DEFAULT_ERROR_MSG
): string {
  if (!data) return fallbackMessage;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    if (data.errorMessage) return data.errorMessage;
    if (data.message) return data.message;
    if (data.title) return data.title;
  }
  return fallbackMessage;
}

/**
 * Main error handler for axios errors
 */
async function handleErrorResponse(error: any): Promise<never> {
  if (!axios.isAxiosError(error)) {
    toast.error(DEFAULT_ERROR_MSG, { position: "bottom-right" });
    return Promise.reject(new Error(DEFAULT_ERROR_MSG));
  }

  const res = error.response;
  let data = res?.data;

  // Handle 401 Unauthorized - token expired
  if (res?.status === 401) {
    try {
        const text = await data.text();
        data = JSON.parse(text);
      } catch {
        toast.error(DEFAULT_ERROR_MSG, { position: "bottom-right" });
        return Promise.reject(new Error(DEFAULT_ERROR_MSG));
      }
  }

  // Handle 500 or expired refresh token error code
  if (res?.status === 500 || data?.error?.includes("IDX12401")) {
    return Promise.reject(new Error(DEFAULT_ERROR_MSG));
  }

  // Parse Blob JSON error responses
  if (data instanceof Blob && data.type === "application/json") {
    try {
      const text = await data.text();
      data = JSON.parse(text);
    } catch {
      toast.error(DEFAULT_ERROR_MSG, { position: "bottom-right" });
      return Promise.reject(new Error(DEFAULT_ERROR_MSG));
    }
  }

  // Custom errors: show toast and reject accordingly
  if (isCustomErrorResponse(data)) {
    toast.error(data.errorMessage, { position: "bottom-right" });
    return Promise.reject(new Error(data.errorMessage));
  }

  // ASP.NET validation error handling
  if (isAspNetValidationError(data)) {
    const errorList = Object.values(data.errors).flat().join("\n");
    toast.error(errorList, { position: "bottom-right" });
    return Promise.reject(new Error("Xác thực thất bại!"));
  }

  // Final fallback with extracted error message
  const errorMessage = extractErrorMessage(
    data,
    error.message || DEFAULT_ERROR_MSG
  );
  toast.error(errorMessage, { position: "bottom-right" });
  return Promise.reject(new Error(errorMessage));
}

export { defaultAxiosInstance };
