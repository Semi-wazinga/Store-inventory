// src/context/SalesContext.jsx
import { useEffect, useState, useCallback } from "react";
import { SalesContext } from "./sales-context";
import {
  createSale,
  getAllSales,
  getMySales,
  deleteSale,
  getTodaysSales,
  getCurrentUser,
} from "../api/api";

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [todaysSales, setTodaysSales] = useState([]);
  const [todaysMessage, setTodaysMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  // ---------------- FETCH TODAY'S SALES ----------------
  const fetchTodaysSales = useCallback(async () => {
    try {
      const res = await getTodaysSales();

      if (res.data?.message) {
        setTodaysSales([]);
        setTodaysMessage(res.data.message);
      } else {
        setTodaysSales(res.data || []);
        setTodaysMessage(null);
      }
    } catch (err) {
      console.error("Error fetching today's sales:", err);
      setTodaysSales([]);
      setTodaysMessage(null);
    }
  }, []);

  // ---------------- FETCH ROLE SALES ----------------
  const fetchSales = useCallback(async (currentRole) => {
    if (!currentRole) return;

    try {
      setLoading(true);

      if (currentRole === "admin") {
        const res = await getAllSales();
        setAllSales(res.data || []);
      } else {
        const res = await getMySales();
        setSales(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------- FETCH USER ROLE ----------------
  const fetchUserRole = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      const newRole = res.data.user.role;

      setRole(newRole);

      fetchSales(newRole);
      fetchTodaysSales();
    } catch {
      setRole(null);
      setSales([]);
      setAllSales([]);
      setTodaysSales([]);
      setTodaysMessage(null);
    }
  }, [fetchSales, fetchTodaysSales]);

  // ---------------- RECORD SALE (FIXED) ----------------
  const recordSale = async (saleData) => {
    try {
      setLoading(true);

      const res = await createSale(saleData);
      const { updatedProduct } = res.data;

      // ✅ update inventory immediately
      if (updatedProduct) {
        window.dispatchEvent(
          new CustomEvent("product-updated", { detail: updatedProduct })
        );
      }

      await fetchTodaysSales();
      await fetchSales(role);
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE SALE ----------------
  const removeSale = async (id) => {
    try {
      await deleteSale(id);
    } catch (err) {
      // Ignore 404 errors
      if (err.response?.status !== 404) {
        throw err.response?.data || err;
      }
    } finally {
      await fetchTodaysSales();
      await fetchSales(role);
    }
  };

  const resetContexts = () => {
    setSales([]);
    setAllSales([]);
    setTodaysSales([]);
    setTodaysMessage(null);
    setRole(null);
  };

  const loginSuccess = async () => {
    try {
      const res = await getCurrentUser();
      const newRole = res.data.user.role;
      setRole(newRole);
      await fetchSales(newRole);
      await fetchTodaysSales();
      return newRole; // resolves role so caller knows
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    fetchUserRole();

    const handleFocus = () => fetchUserRole();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchUserRole]);

  return (
    <SalesContext.Provider
      value={{
        sales,
        allSales,
        todaysSales,
        todaysMessage,
        loading,
        role,
        setAllSales,
        fetchSales,
        loginSuccess,
        resetContexts,
        fetchTodaysSales,
        recordSale,
        removeSale,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};
