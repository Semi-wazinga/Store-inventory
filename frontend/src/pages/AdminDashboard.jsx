import { useState } from "react";
import AddProductForm from "../components/admin/AddProductForm";
import ProductsTable from "../components/admin/ProductsTable";
import AllSalesTable from "../components/admin/AllSalesTable";
import SalesSummary from "../components/admin/SalesSummary";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='container-small'>
      {/* Header with Title + Search Input */}
      <header className='mb-4 d-flex justify-content-between align-items-center'>
        <h1 className='fw-semibold' style={{ fontSize: "1.5rem" }}>
          Admin Dashboard
        </h1>
      </header>

      <section className='mb-4'>
        <div className='row g-4'>
          <div className='col-md-4'>
            <AddProductForm />
          </div>
          <div className='col-md-8'>
            <SalesSummary />
          </div>
        </div>
      </section>
      <section className=' mb-4'>
        <div className='d-flex justify-content-end mb-3'>
          <input
            type='text'
            placeholder='Search products...'
            className='form-control'
            style={{ maxWidth: "250px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ProductsTable searchTerm={searchTerm} />
      </section>

      <section className='mb-4'>
        <AllSalesTable />
      </section>
    </div>
  );
}
