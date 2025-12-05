import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
      window.location.reload(); // Force reload to reset all context
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <nav className='navbar navbar-expand-lg'>
        <div className='container d-flex justify-content-between align-items-center'>
          <Link className='navbar-brand' to='/'>
            InventoryApp
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
