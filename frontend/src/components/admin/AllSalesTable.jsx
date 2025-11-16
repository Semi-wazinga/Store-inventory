import { useSales } from "../../context/SalesContext";

export default function AllSalesTable() {
  const { allSales, loading, fetchSales, deleteSale } = useSales();

  const handleDelete = async (id) => {
    if (window.confirm("Delete this sale record?")) {
      await deleteSale(id);
      await fetchSales();
    }
  };

  if (loading) return <p>Loading sales...</p>;
  if (!allSales || allSales.length === 0) return <p>No sales yet.</p>;

  return (
    <div className='p-4 bg-white shadow rounded-2xl'>
      <h2 className='text-lg font-semibold mb-3'>All Sales Records</h2>
      <table className='w-full text-left border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2'>#</th>
            <th className='p-2'>Product</th>
            <th className='p-2'>Quantity</th>
            <th className='p-2'>Sold By</th>
            <th className='p-2'>Date</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allSales.map((s, i) => (
            <tr key={s._id} className='border-t'>
              <td className='p-2'>{i + 1}</td>
              <td className='p-2'>{s.product?.name}</td>
              <td className='p-2'>{s.quantity}</td>
              <td className='p-2'>{s.soldBy?.name}</td>
              <td className='p-2'>
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
              <td className='p-2'>
                <button
                  onClick={() => handleDelete(s._id)}
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
