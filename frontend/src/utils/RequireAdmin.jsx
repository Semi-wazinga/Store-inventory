// RequireAdmin.jsx
import { useSales } from "../context/useSales";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const { role } = useSales();

  if (role === null) return <p>Loading user role...</p>; // loading state
  if (role !== "admin") return <Navigate to='/' replace />;

  return children;
};

export default RequireAdmin;

// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const RequireAdmin = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/auth/me", {
//           withCredentials: true, // send cookies
//         });

//         if (res.data.user?.role === "admin") {
//           setIsAdmin(true);
//         }
//       } catch (err) {
//         console.error(
//           "Auth check failed:",
//           err.response?.status || err.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) return <p>Checking authentication...</p>;

//   return isAdmin ? children : <Navigate to='/' replace />;
// };

// export default RequireAdmin;
