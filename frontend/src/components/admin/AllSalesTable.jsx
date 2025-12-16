import { useState } from "react";
import { useSales } from "../../context/useSales";
import { useProducts } from "../../context/useProducts";
import { Modal, Button } from "react-bootstrap";

export default function AllSalesTable() {
  const {
    allSales,
    sales,
    role,
    loading,
    // setAllSales,
    fetchSales,
    removeSale,
  } = useSales();
  const { fetchProducts } = useProducts();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      await removeSale(selectedId);
      if (fetchSales) await fetchSales(role); // refresh table
      if (fetchProducts) await fetchProducts(); // refresh stock
      closeDeleteModal();
    } catch (err) {
      console.error("Failed to delete sale:", err);
    }
  };

  // const confirmDelete = async () => {
  //   // Remove locally first
  //   setAllSales((prev) => prev.filter((s) => s._id !== selectedId));

  //   try {
  //     await removeSale(selectedId);
  //     await fetchProducts(); // update inventory if necessary
  //     // await fetchSales(role); // refresh sales data
  //   } catch (err) {
  //     console.warn("Delete failed:", err);
  //   } finally {
  //     closeDeleteModal();
  //   }
  // };

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
                    onClick={() => openDeleteModal(s._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this record?
          <br />
          <strong>This action cannot be undone.</strong>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

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
