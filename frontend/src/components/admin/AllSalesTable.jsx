import { useSales } from "../../context/useSales";

export default function AllSalesTable() {
  const { allSales, sales, role, loading, fetchSales, removeSale } = useSales();

  const handleDelete = async (id) => {
    if (window.confirm("Delete this sale record?")) {
      await removeSale(id);
      await fetchSales();
    }
  };

  if (loading) return <p>Loading sales...</p>;

  const salesToDisplay = role === "admin" ? allSales : sales;

  return (
    <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>
        {role === "admin" ? "All Sales Records" : "My Sales Records"}
      </h3>

      <table className='table table-hover table-round align-middle mb-0'>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            {role === "admin" && <th>Sold By</th>}
            <th>Date</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {(!salesToDisplay || salesToDisplay.length === 0) && (
            <tr>
              <td
                colSpan={role === "admin" ? 6 : 5}
                className='text-center py-4 fw-semibold'
              >
                No sales found
              </td>
            </tr>
          )}

          {salesToDisplay.map((s, index) => (
            <tr key={s._id}>
              {/* Index */}
              <td>{index + 1}</td>

              {/* Product Avatar + Name */}
              <td>
                <div className='d-flex align-items-center'>
                  <div className='avatar text-primary'>
                    <i className='fs-4' data-duoicon='shopping-bag'></i>
                  </div>

                  <div className='ms-3'>
                    <div className='fw-semibold'>
                      {s.product?.name || "Unknown Product"}
                    </div>
                    <div className='text-muted small'>
                      {s.product?.category || "No category"}
                    </div>
                  </div>
                </div>
              </td>

              {/* Quantity Badge */}
              <td>
                <span className='badge bg-primary-subtle text-primary'>
                  {s.quantity}
                </span>
              </td>

              {/* Sold By (admin only) */}
              {role === "admin" && (
                <td>
                  <div className='fw-semibold'>{s.soldBy?.name}</div>
                  <div className='text-muted small'>{s.soldBy?.role}</div>
                </td>
              )}

              {/* Date */}
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>

              {/* Actions */}
              <td>
                <div className='d-flex gap-2'>
                  <button
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDelete(s._id)}
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
