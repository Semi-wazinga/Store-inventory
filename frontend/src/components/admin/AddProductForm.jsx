import { useState } from "react";
import { useProducts } from "../../context/useProducts";

export default function AddProductForm() {
  const { addProduct, fetchProducts } = useProducts();

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price)
      return alert("Please fill all required fields");

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      };

      await addProduct(payload);
      await fetchProducts();

      alert("Product added successfully");

      // Reset form
      setForm({
        name: "",
        category: "",
        quantity: "",
        price: "",
      });
    } catch (err) {
      console.error("Create product error:", err);
      alert(err.error || err.message || "Failed to add product");
    }
  };

  return (
    <div className='bg-white shadow rounded-3 p-4'>
      <h3 className='mb-4 text-center fw-semibold'>Add New Product</h3>

      <form onSubmit={handleSubmit} className='row g-3'>
        {/* Product Name + Category (Same Row) */}
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

        {/* Quantity + Price (Same Row) */}
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
  );
}
