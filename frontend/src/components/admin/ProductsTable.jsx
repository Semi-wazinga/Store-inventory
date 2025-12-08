import { useState, useMemo } from "react";
import { useProducts } from "../../context/useProducts";
import { Modal, Button, Form } from "react-bootstrap";

export default function ProductsTable({ searchTerm }) {
  const { products, editProduct, deleteProduct, loading, fetchProducts } =
    useProducts();

  // Pagination
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
  });

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // FILTERED PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;

  const currentProducts = filteredProducts.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // Open Edit Modal
  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    });
    setShowModal(true);
  };

  // Save edited product
  const handleSave = async () => {
    if (!currentProduct) return;

    await editProduct(currentProduct._id, formData);
    await fetchProducts();
    setShowModal(false);
  };

  // Open Delete modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    await deleteProduct(productToDelete._id);
    await fetchProducts();
    setShowDeleteModal(false);
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
          {currentProducts.length === 0 && (
            <tr>
              <td colSpan='6' className='text-center py-4 fw-semibold'>
                No products found
              </td>
            </tr>
          )}

          {currentProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.quantity}</td>
              <td>${p.price}</td>

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

              <td>
                <div className='d-flex gap-2'>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>

                  <button
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDeleteClick(p)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className='d-flex justify-content-center mt-4'>
        <nav>
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
        </nav>
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{productToDelete?.name}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
