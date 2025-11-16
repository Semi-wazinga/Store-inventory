// src/context/SalesContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  createSale,
  getAllSales,
  getMySales,
  deleteSale,
  getTodaysSales,
} from "../api/api";
import { useProducts } from "./ProductContext"; // use the hook instead of context object

const SalesContext = createContext();

export const SalesProvider = ({ children, role }) => {
  const [sales, setSales] = useState([]); // initialize as array
  const [allSales, setAllSales] = useState([]);
  const [todaysSales, setTodaysSales] = useState([]); // initialize as array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchProducts, updateLocalProductQuantity } = useProducts(); // fetchProducts from product context

  // === Fetch sales (admin or storekeeper) ===
  const fetchSales = async () => {
    try {
      setLoading(true);

      if (role === "admin") {
        const res = await getAllSales();
        setAllSales(res.data || []); // <-- FIX HERE
      } else {
        const res = await getMySales();
        setSales(res.data || []); // <-- store only MY sales
      }
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Not logged in yet — skipping sales fetch.");
      } else {
        console.error("Error fetching sales:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // === Record sale (storekeeper) ===
  const recordSale = async (saleData) => {
    try {
      setLoading(true);

      // ⬅ API RESPONSE STRUCTURE
      const res = await createSale(saleData);
      const { sale, updatedProduct } = res.data;

      // 1️⃣ Update sales list in real-time
      setSales((prev) => [...prev, sale]);

      // 2️⃣ Update today's sales
      setTodaysSales((prev) => [...prev, sale]);

      // INSTANT local inventory update
      updateLocalProductQuantity(updatedProduct);

      return sale;
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  // === Delete sale (admin only) ===
  const removeSale = async (id) => {
    try {
      await deleteSale(id);
      setSales((prev = []) => prev.filter((s) => s._id !== id));
      await fetchTodaysSales();
      await fetchProducts();
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // === Get today's sales summary ===
  const fetchTodaysSales = async () => {
    try {
      const res = await getTodaysSales();
      setTodaysSales(res.data || []); // fallback to empty array
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Not logged in yet — skipping today's sales fetch.");
      } else {
        console.error("Error fetching today's sales:", err);
      }
      setTodaysSales([]); // ensure array
    }
  };

  useEffect(() => {
    fetchSales();
    fetchTodaysSales();
  }, [role]);

  return (
    <SalesContext.Provider
      value={{
        sales,
        allSales,
        todaysSales,
        loading,
        error,
        fetchSales,
        recordSale,
        removeSale,
        fetchTodaysSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

// export const useSales = () => useContext(SalesContext);

// --- Custom Hook ---
export function useSales() {
  return useContext(SalesContext);
}
