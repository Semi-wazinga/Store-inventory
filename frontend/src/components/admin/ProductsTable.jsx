import { useProducts } from "../../context/useProducts";

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
    <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>All Products</h3>

      <table className='table table-hover table-round align-middle mb-0'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan='6' className='text-center py-4 fw-semibold'>
                No products found
              </td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p._id}>
              {/* Product Name + Icon */}
              <td>
                <div className='d-flex align-items-center'>
                  <div className='avatar text-primary'>
                    <i className='fs-4' data-duoicon='camera-square'></i>
                  </div>
                  <div className='ms-3'>
                    <div className='fw-semibold'>{p.name}</div>
                  </div>
                </div>
              </td>

              <td>{p.category}</td>
              <td>{p.quantity}</td>
              <td>${p.price}</td>

              {/* Stock Status */}
              <td>
                {p.quantity > 10 ? (
                  <span className='badge bg-success-subtle text-success'>
                    In Stock
                  </span>
                ) : p.quantity > 0 ? (
                  <span className='badge bg-warning-subtle text-warning'>
                    Limited
                  </span>
                ) : (
                  <span className='badge bg-danger-subtle text-danger'>
                    Out of Stock
                  </span>
                )}
              </td>

              {/* Edit + Delete Buttons */}
              <td>
                <div className='d-flex gap-2'>
                  <button className='btn btn-sm btn-primary'>Edit</button>

                  <button
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// import { useProducts } from "../../context/ProductContext";

// export default function ProductsTable() {
//   const { products, deleteProduct, loading, fetchProducts } = useProducts();

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       await deleteProduct(id);
//       await fetchProducts();
//     }
//   };

//   if (loading) return <p>Loading products...</p>;

//   return (
//     <div className='p-4 bg-white shadow rounded-2xl'>
//       <h2 className='text-lg font-semibold mb-3'>All Products</h2>
//       <table className='w-full text-left border'>
//         <thead>
//           <tr className='bg-gray-100'>
//             <th className='p-2'>#</th>
//             <th className='p-2'>Name</th>
//             <th className='p-2'>Category</th>
//             <th className='p-2'>Qty</th>
//             <th className='p-2'>Price</th>
//             <th className='p-2'>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((p, i) => (
//             <tr key={p._id} className='border-t'>
//               <td className='p-2'>{i + 1}</td>
//               <td className='p-2'>{p.name}</td>
//               <td className='p-2'>{p.category}</td>
//               <td className='p-2'>{p.quantity}</td>
//               <td className='p-2'>${p.price}</td>
//               <td className='p-2'>
//                 <button
//                   onClick={() => handleDelete(p._id)}
//                   className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
