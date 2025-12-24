import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useProducts } from "../../context/useProducts";

export default function AddProductForm() {
  const { addProduct, fetchProducts } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stockType: "packet", // default
    stockQuantity: 0, // packets, bottles or cartons
    packetsPerCarton: 0,
    cardsPerPacket: 1,
    pricePerCarton: 0,
    pricePerPacket: 0,
    pricePerCard: 0,
    pricePerBottle: 0,
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.category || !formData.stockQuantity) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.stockType === "packet") {
      if (
        !formData.cardsPerPacket ||
        !formData.pricePerPacket ||
        !formData.pricePerCard
      ) {
        setError(
          "Packets must have cards per packet, price per packet, and price per card"
        );
        return;
      }
    } else if (formData.stockType === "bottle") {
      if (!formData.pricePerBottle) {
        setError("Bottles must have price per bottle");
        return;
      }
    } else if (formData.stockType === "carton") {
      if (
        !formData.packetsPerCarton ||
        !formData.pricePerCarton ||
        !formData.pricePerPacket
      ) {
        setError(
          "Cartons must have packetsPerCarton, price per carton, and price per packet"
        );
        return;
      }
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      stockType: formData.stockType,
      stockQuantity: Number(formData.stockQuantity),
      description: formData.description,
    };

    // Ensure type-specific fields
    if (formData.stockType === "packet") {
      payload.cardsPerPacket = Number(formData.cardsPerPacket);
      payload.pricePerPacket = Number(formData.pricePerPacket);
      payload.pricePerCard = Number(formData.pricePerCard);
    } else if (formData.stockType === "bottle") {
      // Important: use formData.pricePerBottle (not pricePerCard)
      const price = Number(formData.pricePerBottle);
      if (!price || price <= 0) {
        setError("Please enter a valid price per bottle");
        return;
      }
      payload.pricePerBottle = price;
      payload.pricePerCard = 0; // default for bottles
    } else if (formData.stockType === "carton") {
      payload.packetsPerCarton = Number(formData.packetsPerCarton);
      payload.pricePerCarton = Number(formData.pricePerCarton);
      payload.pricePerPacket = Number(formData.pricePerPacket);
    }

    try {
      setLoading(true);
      await addProduct(payload); // call ProductContext function
      await fetchProducts(); // refresh product list

      // Reset form
      setFormData({
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
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='p-4 bg-white shadow rounded-3'>
      {error && <p className='text-danger'>{error}</p>}

      <Form.Group className='mb-3'>
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder='Enter product name'
          required
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Category</Form.Label>
        <Form.Control
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          placeholder='Enter category'
          required
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
        <Form.Label>
          Stock Quantity (
          {formData.stockType === "bottle"
            ? "Bottles"
            : formData.stockType === "carton"
            ? "Cartons"
            : "Packets"}
          )
        </Form.Label>
        <Form.Control
          type='number'
          value={formData.stockQuantity}
          onChange={(e) =>
            setFormData({ ...formData, stockQuantity: Number(e.target.value) })
          }
          min={1}
          required
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
              min={1}
              required
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
              required
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
              min={0}
              required
            />
          </Form.Group>
        </>
      )}

      {formData.stockType === "bottle" && (
        <Form.Group className='mb-3'>
          <Form.Label>Price per Bottle</Form.Label>
          <Form.Control
            type='number'
            value={formData.pricePerBottle}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricePerBottle: Number(e.target.value),
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
              required
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
              required
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
              required
            />
          </Form.Group>
        </>
      )}

      <Button type='submit' variant='primary' disabled={loading}>
        {loading ? "Saving..." : "Add Product"}
      </Button>
    </Form>
  );
}
