import { useState } from "react";
import { useProducts } from "../../context/useProducts";
import { useSales } from "../../context/useSales";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

export default function RecordSaleForm() {
  const { products, updateLocalProductQuantity } = useProducts();
  const { recordSale } = useSales();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) return alert("Select a product and quantity");

    try {
      const { updatedProduct } = await recordSale({
        productId,
        quantity: Number(quantity),
      });

      updateLocalProductQuantity(updatedProduct);
      alert("Sale recorded successfully!");
      setProductId("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert(err.error || "Error recording sale");
    }
  };

  return (
    <Card className='p-4 shadow-sm mb-4'>
      <Card.Title className='text-center mb-4 fw-bold fs-4'>
        Record a Sale
      </Card.Title>
      <Form onSubmit={handleSubmit}>
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
              max={
                productId
                  ? products.find((p) => p._id === productId)?.quantity
                  : undefined
              }
              placeholder='Quantity Sold'
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
  );
}
