import AddProductForm from "../components/admin/AddProductForm";
import ProductsTable from "../components/admin/ProductsTable";
import AllSalesTable from "../components/admin/AllSalesTable";

export default function AdminDashboard() {
  return (
    <div className='container-small'>
      <header className='mb-4'>
        <h1 className='fw-semibold' style={{ fontSize: "1.5rem" }}>
          Admin Dashboard
        </h1>
      </header>

      <section className='dashboard-grid mb-4'>
        <AddProductForm />
        <ProductsTable />
      </section>

      <section className='mb-4'>
        <AllSalesTable />
      </section>
    </div>
  );
}
