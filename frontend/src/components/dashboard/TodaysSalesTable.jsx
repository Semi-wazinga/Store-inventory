import { useSales } from "../../context/useSales";

export default function TodaysSalesTable() {
  const { todaysSales, loading, todaysMessage, role } = useSales();

  // Wait for role to be determined before showing anything
  if (!role || loading) return <p>Loading today's sales...</p>;

  // No sales message from backend
  if (todaysMessage) return <p>{todaysMessage}</p>;

  // If array is empty
  if (!todaysSales || todaysSales.length === 0)
    return <p>No sales recorded yet.</p>;

  return (
    <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>Today's Sales</h3>
      <table className='table table-hover align-middle mb-0'>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty Sold</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {todaysSales.map((s, i) => (
            <tr key={s._id}>
              <td>{i + 1}</td>
              <td>{s.product?.name || "Product Deleted"}</td>
              <td>{s.quantity}</td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// // src/components/Dashboard/TodaysSalesTable.jsx
// import { useSales } from "../../context/useSales";

// export default function TodaysSalesTable() {
//   const { todaysSales, loading, todaysMessage } = useSales();

//   if (loading) return <p>Loading today's sales...</p>;
//   if (todaysMessage) return <p>{todaysMessage}</p>;
//   if (!todaysSales.length) return <p>No sales recorded yet.</p>;

//   return (
//     <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
//       <h3 className='mb-4 text-center fw-semibold'>Today's Sales</h3>
//       <table className='table table-hover align-middle mb-0'>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Product</th>
//             <th>Qty Sold</th>
//             <th>Date</th>
//           </tr>
//         </thead>

//         <tbody>
//           {todaysSales.map((s, i) => (
//             <tr key={s._id}>
//               <td>{i + 1}</td>
//               <td>{s.product?.name || "Product Deleted"}</td>
//               <td>{s.quantity}</td>
//               <td>{new Date(s.createdAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
