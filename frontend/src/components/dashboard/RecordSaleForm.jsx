import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useSales } from "../../context/SalesContext";

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
    <div className='p-4 bg-white shadow rounded-2xl'>
      <h2 className='text-lg font-semibold mb-3'>Record a Sale</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <select
          className='border p-2 rounded-md'
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
          className='border p-2 rounded-md'
          placeholder='Quantity Sold'
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button
          type='submit'
          className='bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700'
        >
          record sale
        </button>
      </form>
    </div>
  );
}
