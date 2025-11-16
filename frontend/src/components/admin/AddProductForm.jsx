import { useState } from "react";
import { useProducts } from "../../context/ProductContext";

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
    <div className='p-4 bg-white shadow rounded-2xl'>
      <h2 className='text-lg font-semibold mb-3'>Add New Product</h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          name='name'
          value={form.name}
          onChange={handleChange}
          className='border p-2 rounded-md'
          placeholder='Product Name'
        />

        <input
          name='category'
          value={form.category}
          onChange={handleChange}
          className='border p-2 rounded-md'
          placeholder='Category'
        />

        <input
          name='quantity'
          type='number'
          value={form.quantity}
          onChange={handleChange}
          className='border p-2 rounded-md'
          placeholder='Quantity'
        />

        <input
          name='price'
          type='number'
          value={form.price}
          onChange={handleChange}
          className='border p-2 rounded-md'
          placeholder='Price'
        />

        <button
          type='submit'
          className='bg-green-600 text-white rounded-md p-2 hover:bg-green-700'
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
