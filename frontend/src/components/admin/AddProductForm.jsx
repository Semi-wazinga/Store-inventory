import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useProducts } from "../../context/useProducts";

export default function AddProductForm() {
  const { addProduct, fetchProducts } = useProducts();

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info", // "success", "error", "warning"
  });

  const openModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price) {
      return openModal(
        "Missing Fields",
        "Please fill all required fields",
        "warning"
      );
    }

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      };

      await addProduct(payload);
      await fetchProducts();

      openModal("Success", "Product added successfully!", "success");

      // Reset form
      setForm({
        name: "",
        category: "",
        quantity: "",
        price: "",
      });
    } catch (err) {
      console.error("Create product error:", err);
      openModal(
        "Error",
        err.error || err.message || "Failed to add product",
        "error"
      );
    }
  };

  return (
    <>
      {/* MODAL */}
      <Modal show={modal.show} onHide={closeModal} centered>
        <Modal.Header
          closeButton
          className={
            modal.type === "success"
              ? "bg-success text-white"
              : modal.type === "error"
              ? "bg-danger text-white"
              : "bg-warning text-dark"
          }
        >
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className='mb-0'>{modal.message}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* FORM */}
      <div className='bg-white shadow rounded-3 p-4'>
        <h3 className='mb-4 text-center fw-semibold'>Add New Product</h3>

        <form onSubmit={handleSubmit} className='row g-3'>
          {/* Product Name + Category */}
          <div className='col-md-6'>
            <label className='form-label'>Product Name</label>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              className='form-control form-control-lg'
              placeholder='Enter product name'
              required
            />
          </div>

          <div className='col-md-6'>
            <label className='form-label'>Category</label>
            <input
              type='text'
              name='category'
              value={form.category}
              onChange={handleChange}
              className='form-control form-control-lg'
              placeholder='Enter category'
              required
            />
          </div>

          {/* Quantity + Price */}
          <div className='col-md-6'>
            <label className='form-label'>Quantity</label>
            <input
              type='number'
              name='quantity'
              value={form.quantity}
              onChange={handleChange}
              className='form-control form-control-lg'
              placeholder='Enter quantity'
            />
          </div>

          <div className='col-md-6'>
            <label className='form-label'>Price</label>
            <input
              type='number'
              name='price'
              value={form.price}
              onChange={handleChange}
              className='form-control form-control-lg'
              placeholder='Enter price'
              required
            />
          </div>

          {/* Submit Button */}
          <div className='col-12 mt-3'>
            <button type='submit' className='btn btn-success btn-lg w-100'>
              Add Product
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
