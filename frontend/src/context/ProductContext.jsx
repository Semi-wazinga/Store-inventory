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

  // === Fetch all products from API ===
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProducts();

      const validProducts = (res.data || []).filter((p) => p && p._id);

      const normalized = validProducts.map((p) => ({
        ...p,
        stockQuantity: Number(p.stockQuantity),
        packetsPerCarton: Number(p.packetsPerCarton ?? 0),
        cardsPerPacket: Number(p.cardsPerPacket ?? 0),
        pricePerCarton: Number(p.pricePerCarton ?? 0),
        pricePerPacket: Number(p.pricePerPacket ?? 0),
        pricePerCard: Number(p.pricePerCard ?? 0),
        pricePerBottle: Number(p.pricePerBottle ?? 0),
      }));

      setProducts(normalized);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  // === Add / Create Product ===
  const addProduct = async (productData) => {
    try {
      const res = await createProduct(productData);
      const newProduct = res.data.product;
      if (!newProduct?._id) return;

      setProducts((prev) => [...prev, newProduct]);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // === Update existing product ===
  const editProduct = async (id, updates) => {
    try {
      const res = await updateProduct(id, updates);
      const updatedProduct = res.data.product;
      if (!updatedProduct?._id) return;

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updatedProduct : p))
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

  // === Listen for product-updated events globally ===
  useEffect(() => {
    const handler = (e) => {
      const updatedProduct = e.detail;

      if (!updatedProduct?._id) return;

      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    };

    window.addEventListener("product-updated", handler);
    return () => window.removeEventListener("product-updated", handler);
  }, []);

  // === Auto-load products on mount or when role changes ===
  useEffect(() => {
    if (role) fetchProducts();
    else setProducts([]);
  }, [role, fetchProducts]);

  // === Helper functions to display stock ===
  const getStockCartons = (product) =>
    product?.stockType === "carton" ? product.stockQuantity : 0;

  const getStockPackets = (product) =>
    product?.stockType === "packet"
      ? product.stockQuantity
      : product?.stockType === "carton"
      ? product.stockQuantity * product.packetsPerCarton
      : 0;

  const getStockCards = (product) =>
    product?.stockType === "card"
      ? product.stockQuantity
      : product?.stockType === "packet"
      ? product.stockQuantity * product.cardsPerPacket
      : 0;

  const getStockBottles = (product) =>
    product?.stockType === "bottle" ? product.stockQuantity : 0;

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
        deleteProduct: removeProduct,
        getStockCartons,
        getStockPackets,
        getStockCards,
        getStockBottles,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
