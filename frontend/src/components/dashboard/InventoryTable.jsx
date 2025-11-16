import { useProducts } from "../../context/ProductContext";

export default function InventoryTable() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading inventory...</p>;
  if (!products.length) return <p>No products available.</p>;

  return (
    <div className='p-4 bg-white shadow rounded-2xl'>
      <h2 className='text-lg font-semibold mb-3'>Current Inventory</h2>
      <table className='w-full text-left border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2'>#</th>
            <th className='p-2'>Product</th>
            <th className='p-2'>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id} className='border-t'>
              <td className='p-2'>{i + 1}</td>
              <td className='p-2'>{p.name}</td>
              <td className='p-2'>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
