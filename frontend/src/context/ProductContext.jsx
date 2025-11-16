// src/context/ProductContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === Fetch all products ===
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // === Create new product (Admin) ===
  const addProduct = async (productData) => {
    try {
      const res = await createProduct(productData);
      setProducts((prev) => [...prev, res.data.product]);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  //Gives he current quantity after each sale
  const updateLocalProductQuantity = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  // === Update existing product ===
  const editProduct = async (id, updates) => {
    try {
      const res = await updateProduct(id, updates);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data.product : p))
      );
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // === Delete product ===
  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // === Auto-load on mount ===
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
        updateLocalProductQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
