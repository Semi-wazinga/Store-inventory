import { useSales } from "../context/useSales";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const RequireAdmin = ({ children }) => {
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

  // Only admins allowed
  if (role !== "admin") return <Navigate to='/login' replace />;

  return children;
};

export default RequireAdmin;

// // RequireAdmin.jsx
// import { useSales } from "../context/useSales";
// import { Navigate } from "react-router-dom";

// const RequireAdmin = ({ children }) => {
//   const { role } = useSales();

//   if (role !== "admin") {
//     return <Navigate to='/login' replace />; // redirect to login if not admin
//   }

//   return children;
// };

// export default RequireAdmin;
