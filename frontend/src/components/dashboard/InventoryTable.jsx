import { useProducts } from "../../context/useProducts";

export default function InventoryTable() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading inventory...</p>;
  if (!products.length) return <p>No products available.</p>;

  return (
    <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>Current Inventory</h3>

      <table className='table table-hover align-middle mb-0'>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
