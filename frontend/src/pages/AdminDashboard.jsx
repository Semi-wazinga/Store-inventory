import AddProductForm from "../components/admin/AddProductForm";
import ProductsTable from "../components/admin/ProductsTable";
import AllSalesTable from "../components/admin/AllSalesTable";

export default function AdminDashboard() {
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <AddProductForm />
        <AllSalesTable />
      </div>

      <ProductsTable />
    </div>
  );
}
