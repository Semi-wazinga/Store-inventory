import { useState } from "react";
import { useProducts } from "../../context/useProducts";
import { useSales } from "../../context/useSales";
import { Card, Form, Button, Row, Col, Modal } from "react-bootstrap";

export default function RecordSaleForm() {
  const { products, updateLocalProductQuantity } = useProducts();
  const { recordSale } = useSales();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = products.find((p) => p._id === productId);

  // Open modal
  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!productId || !quantity) {
      setError("Please select a product and quantity");
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  // Confirm sale
  const handleConfirmSale = async () => {
    try {
      setLoading(true);
      const { updatedProduct } = await recordSale({
        productId,
        quantity: Number(quantity),
      });

      // Update products in context
      updateLocalProductQuantity(updatedProduct);

      // Dispatch event so other components like InventoryTable update
      window.dispatchEvent(
        new CustomEvent("product-updated", { detail: updatedProduct })
      );

      // Reset form & close modal
      setProductId("");
      setQuantity("");
      setShowConfirm(false);
    } catch (err) {
      setError(err?.error || "Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className='p-4 shadow-sm mb-4'>
        <Card.Title className='text-center mb-4 fw-bold fs-4'>
          Record a Sale
        </Card.Title>

        {error && <div className='alert alert-danger py-2'>{error}</div>}

        <Form onSubmit={handleOpenConfirm}>
          <Row className='mb-3'>
            <Col>
              <Form.Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value=''>-- Choose Product --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.quantity} in stock)
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Control
                type='number'
                min='1'
                max={selectedProduct?.quantity}
                placeholder='Quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Col>
          </Row>
          <Button type='submit' className='w-100 btn-success'>
            Record Sale
          </Button>
        </Form>
      </Card>

      {/* Confirm Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to record this sale?
          <br />
          <strong>
            {selectedProduct?.name} — {quantity} unit(s)
          </strong>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowConfirm(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='success'
            onClick={handleConfirmSale}
            disabled={loading}
          >
            {loading ? "Recording..." : "Confirm Sale"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
