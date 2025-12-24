import { useState, useMemo, useEffect } from "react";
import { useSales } from "../../context/useSales";
import { useProducts } from "../../context/useProducts";
import { Modal, Button } from "react-bootstrap";

export default function AllSalesTable() {
  const { allSales, sales, role, loading, fetchSales, removeSale } = useSales();
  const { fetchProducts } = useProducts();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const salesToDisplay = role === "admin" ? allSales : sales;

  // DATE FILTER (HOOK MUST BE HERE)
  const filteredSales = useMemo(() => {
    return salesToDisplay.filter((sale) => {
      const saleDate = new Date(sale.createdAt);

      if (startDate && saleDate < new Date(startDate)) return false;

      if (endDate && saleDate > new Date(endDate + "T23:59:59")) return false;

      return true;
    });
  }, [salesToDisplay, startDate, endDate]);

  // RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  // helper: format quantity with sale unit
  const formatQty = (qty, unit) => {
    const q = Number(qty) || 0;
    const u = unit || "unit";
    return `${q} ${u}${q === 1 ? "" : "s"}`;
  };

  // SAFE EARLY RETURN (after hooks)
  if (loading) return <p>Loading sales...</p>;

  // PAGINATION
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(startIdx, startIdx + itemsPerPage);

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
      if (fetchSales) await fetchSales(role);
      if (fetchProducts) await fetchProducts();
      closeDeleteModal();
    } catch (err) {
      console.error("Failed to delete sale:", err);
    }
  };

  return (
    <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>
        {role === "admin" ? "All Sales Records" : "My Sales Records"}
      </h3>

      {/* DATE RANGE FILTER */}
      <div className='row g-3 mb-3'>
        <div className='col-md-4'>
          <label className='form-label'>From</label>
          <input
            type='date'
            className='form-control'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className='col-md-4'>
          <label className='form-label'>To</label>
          <input
            type='date'
            className='form-control'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className='col-md-4 d-flex align-items-end'>
          <button
            className='btn btn-outline-secondary w-100'
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear Filter
          </button>
        </div>
      </div>

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
                No sales found for selected date range
              </td>
            </tr>
          )}

          {currentSales.map((s, index) => (
            <tr key={s._id}>
              <td>{startIdx + index + 1}</td>

              <td>
                <div className='fw-semibold'>
                  {s.product?.name || "Unknown Product"}
                </div>
                <div className='text-muted small'>
                  {s.product?.category || "No category"}
                </div>
              </td>

              <td>
                <span className='badge bg-primary-subtle text-primary'>
                  {formatQty(s.quantity, s.saleUnit)}
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
                <button
                  className='btn btn-sm btn-danger'
                  onClick={() => openDeleteModal(s._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DELETE MODAL */}
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className='d-flex justify-content-center mt-4'>
          <ul className='pagination'>
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className='page-link'
                onClick={() => changePage(currentPage - 1)}
              >
                Prev
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className='page-link' onClick={() => changePage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

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
        </div>
      )}
    </div>
  );
}
