import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreKeeper, AdminDashboard, Login, Register } from "./pages";
import Navbar from "./components/Navbar";
import { SalesProvider } from "./context/SalesContext";
import { ProductProvider } from "./context/ProductContext";
import RequireAuth from "./utils/RequireAuth";
import RequireAdmin from "./utils/RequireAdmin";

function App() {
  return (
    <>
      <SalesProvider>
        <ProductProvider>
          <BrowserRouter>
            <Navbar />
            <div>
              <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route
                  path='/admin'
                  element={
                    <RequireAdmin>
                      <AdminDashboard />
                    </RequireAdmin>
                  }
                />
                <Route
                  path='/store'
                  element={
                    <RequireAuth>
                      <StoreKeeper />
                    </RequireAuth>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </ProductProvider>
      </SalesProvider>
    </>
  );
}

export default App;
