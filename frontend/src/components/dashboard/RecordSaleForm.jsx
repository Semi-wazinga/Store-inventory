import { useState } from "react";
import { useProducts } from "../../context/useProducts";
import { useSales } from "../../context/useSales";

export default function RecordSaleForm() {
  const { products } = useProducts();
  const { recordSale } = useSales();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) return alert("Select a product and quantity");

    try {
      await recordSale({ productId, quantity: Number(quantity) });
      alert("Sale recorded successfully!");
      setProductId("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert(err.error || "Error recording sale");
    }
  };

  return (
    <div className='bg-white p-4 shadow rounded-3'>
      <h3 className='mb-4 text-center fw-semibold'>Record a Sale</h3>
      <form onSubmit={handleSubmit} className=''>
        <select
          className='form-control form-control-lg'
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value=''>-- Choose Product --</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type='number'
          min='1'
          max={
            productId
              ? products.find((p) => p._id === productId)?.quantity
              : undefined
          }
          className='form-control form-control-lg'
          placeholder='Quantity Sold'
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className='col-12 mt-3'>
          <button type='submit' className='btn btn-success btn-lg w-100'>
            Record Sale
          </button>
        </div>
      </form>
    </div>
  );
}
