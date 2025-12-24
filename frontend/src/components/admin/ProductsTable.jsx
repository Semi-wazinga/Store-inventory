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
    stockType: "packet",
    stockQuantity: 0,
    packetsPerCarton: 0,
    cardsPerPacket: 1,
    pricePerCarton: 0,
    pricePerPacket: 0,
    pricePerCard: 0,
    pricePerBottle: 0,
    description: "",
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

  // // Calculate total cards and packets
  // const getTotalCards = (product) =>
  //   product.stockType === "packet"
  //     ? product.stockQuantity * product.cardsPerPacket
  //     : product.stockQuantity;

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stockType: product.stockType,
      stockQuantity: product.stockQuantity,
      packetsPerCarton: product.packetsPerCarton || 0,
      cardsPerPacket: product.cardsPerPacket || 1,
      pricePerCarton: product.pricePerCarton || 0,
      pricePerPacket: product.pricePerPacket || 0,
      pricePerBottle: product.pricePerBottle || 0,
      pricePerCard: product.pricePerCard || 0,
      description: product.description || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!currentProduct) return;

    const payload = {
      name: formData.name,
      category: formData.category,
      stockType: formData.stockType,
      stockQuantity: Number(formData.stockQuantity),
      description: formData.description,
    };

    if (formData.stockType === "packet") {
      payload.cardsPerPacket = Number(formData.cardsPerPacket);
      payload.pricePerPacket = Number(formData.pricePerPacket);
      payload.pricePerCard = Number(formData.pricePerCard);
    } else if (formData.stockType === "bottle") {
      payload.pricePerBottle = Number(formData.pricePerBottle);
      payload.pricePerCard = 0; // optional
      payload.pricePerPacket = 0; // optional
    } else if (formData.stockType === "carton") {
      payload.packetsPerCarton = Number(formData.packetsPerCarton);
      payload.pricePerCarton = Number(formData.pricePerCarton);
      payload.pricePerPacket = Number(formData.pricePerPacket);
    }

    await editProduct(currentProduct._id, payload);
    await fetchProducts();
    setShowModal(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deleteProduct(productToDelete._id);
    await fetchProducts();
    setShowDeleteModal(false);
  };

  const formatInt = (num) => Math.round(num);

  const formatDecimal = (num, decimals = 1) =>
    Number.isInteger(num) ? num : Number(num.toFixed(decimals));

  if (loading) return <p>Loading products...</p>;

  return (
    <div className='table-responsive mb-7 bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>All Products</h3>

      <table className='table table-hover table-round align-middle mb-0'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Cards/Packet</th>
            <th>Price/Packet</th>
            <th>Price</th>
            <th>Status</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.length === 0 && (
            <tr>
              <td colSpan='8' className='text-center py-4 fw-semibold'>
                No products found
              </td>
            </tr>
          )}

          {currentProducts.map((p) => {
            const totalPackets =
              p.stockType === "packet"
                ? p.stockQuantity
                : p.stockType === "carton"
                ? p.stockQuantity * p.packetsPerCarton
                : null;

            const totalCards =
              p.stockType === "packet"
                ? p.stockCards ?? p.stockQuantity * p.cardsPerPacket
                : null;

            const displayUnits =
              p.stockType === "packet" || p.stockType === "carton"
                ? totalPackets
                : p.stockQuantity;

            return (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>
                  {p.stockType === "packet"
                    ? `${formatDecimal(totalPackets, 1)} packet${
                        formatDecimal(totalPackets, 1) !== 1 ? "s" : ""
                      } (${formatInt(totalCards)} cards)`
                    : p.stockType === "carton"
                    ? `${formatDecimal(totalPackets, 1)} packet${
                        formatDecimal(totalPackets, 1) !== 1 ? "s" : ""
                      }`
                    : `${formatInt(p.stockQuantity)} bottle${
                        p.stockQuantity !== 1 ? "s" : ""
                      }`}
                </td>

                <td>
                  {p.stockType === "packet" ? p.cardsPerPacket || "-" : "-"}
                </td>
                <td>
                  {p.stockType === "packet" || p.stockType === "carton"
                    ? `₦${p.pricePerPacket?.toFixed(2)}`
                    : "-"}
                </td>
                <td>
                  {p.stockType === "packet"
                    ? `₦${p.pricePerCard?.toFixed(2)} /card`
                    : p.stockType === "bottle"
                    ? `₦${p.pricePerBottle?.toFixed(2)} /bottle`
                    : p.stockType === "carton"
                    ? `₦${p.pricePerCarton?.toFixed(2)} /carton`
                    : "-"}
                </td>
                <td>
                  {displayUnits > 10 ? (
                    <span className='badge bg-success-subtle text-success'>
                      In Stock
                    </span>
                  ) : displayUnits > 0 ? (
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
            );
          })}
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
              <Form.Label>Stock Type</Form.Label>
              <Form.Select
                value={formData.stockType}
                onChange={(e) =>
                  setFormData({ ...formData, stockType: e.target.value })
                }
              >
                <option value='packet'>Packet</option>
                <option value='bottle'>Bottle</option>
                <option value='carton'>Carton</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type='number'
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: Number(e.target.value),
                  })
                }
              />
            </Form.Group>

            {formData.stockType === "packet" && (
              <>
                <Form.Group className='mb-3'>
                  <Form.Label>Cards per Packet</Form.Label>
                  <Form.Control
                    type='number'
                    value={formData.cardsPerPacket}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardsPerPacket: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Price per Packet</Form.Label>
                  <Form.Control
                    type='number'
                    value={formData.pricePerPacket}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerPacket: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Price per Card</Form.Label>
                  <Form.Control
                    type='number'
                    value={formData.pricePerCard}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerCard: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </>
            )}

            {formData.stockType === "bottle" && (
              <Form.Group className='mb-3'>
                <Form.Label>Price per Bottle</Form.Label>
                <Form.Control
                  type='number'
                  value={formData.pricePerBottle} // ✅ use the correct field
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerBottle: Number(e.target.value), // ✅ update correct field
                    })
                  }
                  min={0}
                  required
                />
              </Form.Group>
            )}

            {formData.stockType === "carton" && (
              <>
                <Form.Group className='mb-3'>
                  <Form.Label>Packets per Carton</Form.Label>
                  <Form.Control
                    type='number'
                    value={formData.packetsPerCarton}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packetsPerCarton: Number(e.target.value),
                      })
                    }
                    min={1}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Price per Carton</Form.Label>
                  <Form.Control
                    type='number'
                    value={formData.pricePerCarton}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerCarton: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Price per Packet</Form.Label>
                  <Form.Control
                    type='number'
                    value={formData.pricePerPacket}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerPacket: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
