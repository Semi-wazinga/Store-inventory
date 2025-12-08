import { useState } from "react";
import AddProductForm from "../components/admin/AddProductForm";
import ProductsTable from "../components/admin/ProductsTable";
import AllSalesTable from "../components/admin/AllSalesTable";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='container-small'>
      {/* Header with Title + Search Input */}
      <header className='mb-4 d-flex justify-content-between align-items-center'>
        <h1 className='fw-semibold' style={{ fontSize: "1.5rem" }}>
          Admin Dashboard
        </h1>

        <input
          type='text'
          placeholder='Search products...'
          className='form-control'
          style={{ maxWidth: "250px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      <section className='dashboard-grid mb-4'>
        <AddProductForm />
        <ProductsTable searchTerm={searchTerm} />
      </section>

      <section className='mb-4'>
        <AllSalesTable />
      </section>
    </div>
  );
}
