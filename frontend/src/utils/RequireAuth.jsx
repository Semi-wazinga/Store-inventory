import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/me", {
          withCredentials: true, // send cookies
        });

        if (res.data.user?.role === "storekeeper") {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Checking authentication...</p>;

  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

export default RequireAuth;
