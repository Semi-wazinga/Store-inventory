import { useState, useMemo } from "react";
import { useProducts } from "../../context/useProducts";
import { useSales } from "../../context/useSales";
import { Card, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";

export default function RecordSaleForm() {
  const { products } = useProducts();
  const { recordSale } = useSales();

  const [saleItems, setSaleItems] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saleUnit, setSaleUnit] = useState("card");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = products.find((p) => p._id === productId);

  const handleAddProduct = () => {
    if (!selectedProduct) return setError("Select a product");

    const qty = Number(quantity);
    if (!qty || qty <= 0) return setError("Invalid quantity");

    let available = 0;
    let price = 0;

    if (saleUnit === "card") {
      if (
        selectedProduct.stockType === "bottle" ||
        selectedProduct.stockType === "carton"
      )
        return setError("This product is not sold in cards");

      if (selectedProduct.stockType === "card") {
        available = selectedProduct.stockQuantity;
      } else if (selectedProduct.stockType === "packet") {
        available =
          selectedProduct.stockQuantity * selectedProduct.cardsPerPacket;
      }

      // price fallback: per-card price, or derive from packet
      price =
        selectedProduct.pricePerCard ||
        (selectedProduct.pricePerPacket && selectedProduct.cardsPerPacket
          ? selectedProduct.pricePerPacket / selectedProduct.cardsPerPacket
          : 0);
    }

    if (saleUnit === "packet") {
      if (selectedProduct.stockType === "packet") {
        available = selectedProduct.stockQuantity;
      } else if (selectedProduct.stockType === "carton") {
        available =
          selectedProduct.stockQuantity * selectedProduct.packetsPerCarton;
      } else {
        return setError("This product is not sold in packets");
      }

      price =
        selectedProduct.pricePerPacket ||
        (selectedProduct.pricePerCarton && selectedProduct.packetsPerCarton
          ? selectedProduct.pricePerCarton / selectedProduct.packetsPerCarton
          : 0);
    }

    if (saleUnit === "carton") {
      if (selectedProduct.stockType !== "carton")
        return setError("This product is not sold in cartons");

      available = selectedProduct.stockQuantity;
      price = selectedProduct.pricePerCarton || 0;
    }

    if (saleUnit === "bottle") {
      if (selectedProduct.stockType !== "bottle")
        return setError("This product is not sold in bottles");
      available = selectedProduct.stockQuantity;
      price = selectedProduct.pricePerBottle || 0;
    }

    if (available < qty)
      return setError(`Only ${available} ${saleUnit}s left in stock`);

    setSaleItems((prev) => [
      ...prev,
      { productId, name: selectedProduct.name, quantity: qty, saleUnit, price },
    ]);

    setProductId("");
    setQuantity("");
    setSaleUnit("card");
    setError("");
  };

  const handleRemoveItem = (index) => {
    setSaleItems((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const totalAmount = useMemo(
    () => saleItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [saleItems]
  );

  const handleConfirmSale = async () => {
    try {
      await recordSale(saleItems); // send ALL items once

      setSaleItems([]);
      setShowConfirm(false);
    } catch (err) {
      setError(err?.error || "Sale failed");
    }
  };

  return (
    <>
      <Card className='p-4'>
        <Card.Title>Record Sale</Card.Title>

        {error && <div className='alert alert-danger'>{error}</div>}

        <Row className='g-2'>
          <Col md={4}>
            <Form.Select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value=''>-- Select Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Control
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder='Qty'
            />
          </Col>

          <Col md={3}>
            <Form.Select
              value={saleUnit}
              onChange={(e) => setSaleUnit(e.target.value)}
            >
              <option value='card'>Card</option>
              <option value='packet'>Packet</option>
              <option value='carton'>Carton</option>
              <option value='bottle'>Bottle</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Button onClick={handleAddProduct}>Add</Button>
          </Col>
        </Row>

        {saleItems.length > 0 && (
          <>
            <Table className='mt-3'>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>{i.saleUnit}</td>
                    <td>₦{i.price * i.quantity}</td>
                    <td>
                      <Button
                        variant='danger'
                        size='sm'
                        onClick={() => handleRemoveItem(idx)}
                        aria-label={`Remove ${i.name}`}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className='text-end fw-bold'>Total: ₦{totalAmount}</div>
          </>
        )}

        <Button
          className='mt-3'
          variant='success'
          disabled={!saleItems.length}
          onClick={() => setShowConfirm(true)}
        >
          Confirm Sale
        </Button>
      </Card>

      <Modal show={showConfirm} centered>
        <Modal.Body>Confirm this sale?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant='success' onClick={handleConfirmSale}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
