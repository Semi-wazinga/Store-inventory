import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";
import { useSales } from "../context/useSales";

import "./Navbar.css";

const Navbar = () => {
  const { resetContexts: resetSales } = useSales();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      // 1. Explicitly reset all state contexts
      resetSales();

      // ⚠️ IMPORTANT: Force React to fully re-mount all components
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      // Reset state even if API fails to clean up locally
      resetSales();

      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <nav className='navbar navbar-expand-lg'>
        <div className='container d-flex justify-content-between align-items-center'>
          <Link className='navbar-brand' to='/'>
            Store Inventory
          </Link>
          <div className=''>
            <Link className='nav-link  pe-3 d-inline' to='/admin'>
              Admin
            </Link>
            <Link className='nav-link  pe-3 d-inline' to='/store'>
              Store
            </Link>
            <button
              className='btn btn-sm btn-outline-danger d-inline'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
