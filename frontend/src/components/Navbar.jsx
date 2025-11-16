import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className='navbar navbar-expand-lg'>
        <div className='container'>
          <Link className='navbar-brand' to='/'>
            InventoryApp
          </Link>
          <div className=''>
            <Link className='nav-link  pe-3 d-inline' to='/admin'>
              Admin
            </Link>
            <Link className='nav-link  d-inline' to='/store'>
              Store
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
