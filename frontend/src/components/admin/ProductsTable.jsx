import { useProducts } from "../../context/ProductContext";

export default function ProductsTable() {
  const { products, deleteProduct, loading, fetchProducts } = useProducts();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      await fetchProducts();
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className='p-4 bg-white shadow rounded-2xl'>
      <h2 className='text-lg font-semibold mb-3'>All Products</h2>
      <table className='w-full text-left border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2'>#</th>
            <th className='p-2'>Name</th>
            <th className='p-2'>Category</th>
            <th className='p-2'>Qty</th>
            <th className='p-2'>Price</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id} className='border-t'>
              <td className='p-2'>{i + 1}</td>
              <td className='p-2'>{p.name}</td>
              <td className='p-2'>{p.category}</td>
              <td className='p-2'>{p.quantity}</td>
              <td className='p-2'>${p.price}</td>
              <td className='p-2'>
                <button
                  onClick={() => handleDelete(p._id)}
                  className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
