import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL, // backend URL
  withCredentials: true, // send cookies
});

// ===== Auth =====
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");

// ===== Products =====
export const getProducts = () => api.get("/product");
export const getProductById = (id) => api.get(`/product/${id}`);
export const createProduct = (data) => api.post("/product", data);
export const updateProduct = (id, data) => api.put(`/product/${id}`, data);
export const deleteProduct = (id) => api.delete(`/product/${id}`);

// ===== Sales =====
export const createSale = (data) => api.post("/sales", data);
export const getAllSales = () => api.get("/sales");
export const getMySales = () => api.get("/sales/mine");
export const deleteSale = (id) => api.delete(`/sales/${id}`);
export const getTodaysSales = () => api.get("/sales/today");

export default api;
