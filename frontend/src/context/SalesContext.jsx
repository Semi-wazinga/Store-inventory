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
  const [sales, setSales] = useState([]); // storekeeper sales
  const [allSales, setAllSales] = useState([]); // admin sales
  const [todaysSales, setTodaysSales] = useState([]);
  const [todaysMessage, setTodaysMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  // --- Fetch today's sales ---
  const fetchTodaysSales = useCallback(async () => {
    try {
      const res = await getTodaysSales();
      // API may return either an array or { message: 'No sales today yet' }
      if (res.data && res.data?.message) {
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

  // --- Fetch sales based on role ---
  const fetchSales = useCallback(async (currentRole) => {
    // Takes role as argument now
    if (!currentRole) {
      console.log("fetchSales called but no role set, returning");
      return;
    }

    try {
      console.log("Fetching sales for role:", currentRole);
      setLoading(true);

      if (currentRole === "admin") {
        const res = await getAllSales();
        console.log("Admin - fetched all sales:", res.data?.length || 0);
        setAllSales(res.data || []);
      } else if (currentRole === "storekeeper") {
        const res = await getMySales();
        console.log("Storekeeper - fetched my sales:", res.data?.length || 0);
        setSales(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Fetch current user to determine role ---
  const fetchUserRole = useCallback(async () => {
    try {
      console.log("Fetching user role...");
      const res = await getCurrentUser();
      const newRole = res.data.user.role;
      console.log("User role fetched:", newRole);

      // --- 1. SET ROLE STATE ---
      setRole(newRole);

      // --- 2. IMMEDIATELY TRIGGER DATA FETCHES (Fire and forget promises) ---
      // Do not await these, allow them to run in parallel
      fetchSales(newRole);
      fetchTodaysSales();

      // This relies on ProductProvider listening to the role change, which is fine.
    } catch (err) {
      console.warn("User not logged in yet", err);
      setRole(null);
      setSales([]);
      setAllSales([]);
      setTodaysSales([]);
      setTodaysMessage(null);
    }
  }, [fetchSales, fetchTodaysSales]);

  // --- New: call this after a successful login ---
  const loginSuccess = useCallback(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  // --- Global Context Reset Function ---
  const resetContexts = useCallback(() => {
    console.log("--- EXPLICITLY RESETTING SALES CONTEXT STATE ---");
    setSales([]);
    setAllSales([]);
    setTodaysSales([]);
    setTodaysMessage(null);
    setRole(null);
  }, []);

  // --- Record sale (storekeeper) ---
  const recordSale = async (saleData) => {
    try {
      setLoading(true);
      const res = await createSale(saleData);
      const { sale, updatedProduct } = res.data;

      setSales((prev) => [...prev, sale]);
      setTodaysSales((prev) => [...prev, sale]);

      return { sale, updatedProduct };
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  // --- Delete sale (admin only) ---
  const removeSale = async (id) => {
    try {
      await deleteSale(id);

      if (role === "admin") {
        setAllSales((prev) => prev.filter((s) => s._id !== id));
      } else {
        setSales((prev) => prev.filter((s) => s._id !== id));
      }

      await fetchTodaysSales();
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // --- Initial load on mount ---
  useEffect(() => {
    console.log("SalesProvider mounted, fetching user role...");
    fetchUserRole();

    // Re-fetch user role when window regains focus (user switches back to tab)
    const handleFocus = () => {
      console.log("Window focused, re-checking user role...");
      fetchUserRole();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchUserRole]);

  // // --- Fetch sales and today's sales when role changes ---
  // useEffect(() => {
  //   if (!role) {
  //     console.log("No role set yet, skipping data fetch");
  //     return;
  //   }

  //   console.log("Role changed to:", role, "Fetching sales...");

  //   (async () => {
  //     await fetchSales();
  //     await fetchTodaysSales();
  //     console.log("Sales data fetched for role:", role);
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [role]);

  return (
    <SalesContext.Provider
      value={{
        sales,
        allSales,
        todaysSales,
        todaysMessage,
        loading,
        error,
        role,
        fetchSales,
        recordSale,
        removeSale,
        fetchTodaysSales,
        resetContexts,
        loginSuccess,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

// Note: `useSales` hook was moved to `src/context/useSales.js` to satisfy
// fast-refresh linting rules (file should only export React components).
