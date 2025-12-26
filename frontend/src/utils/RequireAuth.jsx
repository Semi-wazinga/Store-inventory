import { useSales } from "../context/useSales";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const RequireAuth = ({ children }) => {
  const { role, loading } = useSales();

  // Show loading spinner while role is being determined
  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: "70vh" }}
      >
        <Spinner animation='border' role='status' />
        <span className='ms-2'>Checking access...</span>
      </div>
    );
  }

  // Only storekeepers allowed
  if (role !== "storekeeper") return <Navigate to='/login' replace />;

  return children;
};

export default RequireAuth;

// // RequireAuth.jsx
// import { useSales } from "../context/useSales";
// import { Navigate } from "react-router-dom";

// const RequireAuth = ({ children }) => {
//   const { role } = useSales();

//   // if (role === null) return <p>Loading user role...</p>;
//   if (role !== "storekeeper") return <Navigate to='/login' replace />;

//   return children;
// };

// export default RequireAuth;
