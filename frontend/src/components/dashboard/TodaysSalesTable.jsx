// src/components/Dashboard/TodaysSalesTable.jsx
import { useSales } from "../../context/SalesContext";

export default function TodaysSalesTable() {
  const { todaysSales, loading } = useSales();

  if (loading) return <p>Loading today’s sales...</p>;
  if (!todaysSales.length) return <p>No sales recorded yet.</p>;

  return (
    <div className='p-4 bg-white shadow rounded-2xl'>
      <h2 className='text-lg font-semibold mb-3'>Today's Sales</h2>
      <table className='w-full text-left border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2'>#</th>
            <th className='p-2'>Product</th>
            <th className='p-2'>Qty Sold</th>
            <th className='p-2'>Date</th>
          </tr>
        </thead>
        <tbody>
          {todaysSales.map((s, i) => (
            <tr key={s._id} className='border-t'>
              <td className='p-2'>{i + 1}</td>
              <td className='p-2'>{s.product.name}</td>
              <td className='p-2'>{s.quantity}</td>
              <td className='p-2'>
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
