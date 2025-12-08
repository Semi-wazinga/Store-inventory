// src/context/ProductContext.jsx
import { useEffect, useState, useCallback } from "react";
import { ProductContext } from "./product-context";
import { useSales } from "./useSales";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/api";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { role } = useSales();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === Fetch all products ===
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

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

  //Gives he current quantity after each sale
  const updateLocalProductQuantity = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  // === Auto-load on mount ===
  useEffect(() => {
    // Only run if the user is logged in (role is defined)
    if (role) {
      console.log(
        `ProductProvider mounted/role updated, fetching products for role: ${role}`
      );
      fetchProducts();
    } else {
      // If role is null (user logged out), clear products state to prevent stale data
      setProducts([]);
      console.log("User logged out or role missing. Clearing products state.");
    }
  }, [role, fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        setProducts,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
        // backward-compatible alias: some components expect `deleteProduct`
        deleteProduct: removeProduct,
        updateLocalProductQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// `useProducts` moved to `src/context/useProducts.js`
