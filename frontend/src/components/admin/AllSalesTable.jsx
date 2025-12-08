import { useState } from "react";
import { useSales } from "../../context/useSales";
import { useProducts } from "../../context/useProducts";

export default function AllSalesTable() {
  const { allSales, sales, role, loading, fetchSales, removeSale } = useSales();
  const { fetchProducts } = useProducts();

  // Pagination
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this sale record?")) {
      await removeSale(id);
      await fetchSales();
      await fetchProducts();
    }
  };

  if (loading) return <p>Loading sales...</p>;

  const salesToDisplay = role === "admin" ? allSales : sales;

  // PAGINATION LOGIC
  const totalPages = Math.ceil(salesToDisplay.length / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentSales = salesToDisplay.slice(startIdx, startIdx + itemsPerPage);

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          {currentSales.length === 0 && (
            <tr>
              <td
                colSpan={role === "admin" ? 6 : 5}
                className='text-center py-4 fw-semibold'
              >
                No sales found
              </td>
            </tr>
          )}

          {currentSales.map((s, index) => (
            <tr key={s._id}>
              <td>{startIdx + index + 1}</td>

              <td>
                <div className='d-flex align-items-center'>
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

              <td>
                <span className='badge bg-primary-subtle text-primary'>
                  {s.quantity}
                </span>
              </td>

              {role === "admin" && (
                <td>
                  <div className='fw-semibold'>{s.soldBy?.name}</div>
                  <div className='text-muted small'>{s.soldBy?.role}</div>
                </td>
              )}

              <td>{new Date(s.createdAt).toLocaleDateString()}</td>

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

      {/* PAGINATION UI */}
      {totalPages > 1 && (
        <div className='d-flex justify-content-center mt-4'>
          <nav>
            <ul className='pagination'>
              {/* Prev Button */}
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className='page-link'
                  onClick={() => changePage(currentPage - 1)}
                >
                  Prev
                </button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className='page-link'
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              {/* Next Button */}
              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className='page-link'
                  onClick={() => changePage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
