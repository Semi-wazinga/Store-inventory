import { useProducts } from "../../context/useProducts";
import { Card, Table, Badge } from "react-bootstrap";

export default function InventoryTable() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading inventory...</p>;
  if (!products.length) return <p>No products available.</p>;

  return (
    <Card className='p-4 shadow-sm mb-4'>
      <Card.Title className='text-center mb-4 fw-bold fs-4'>
        Current Inventory
      </Card.Title>
      <Table hover responsive className='align-middle mb-0'>
        <thead className='table-light'>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>
                <div className='d-flex align-items-center gap-2'>
                  <span className='fw-semibold'>{p.name}</span>
                  {p.quantity === 0 ? (
                    <Badge bg='danger'>Out of Stock</Badge>
                  ) : p.quantity < 5 ? (
                    <Badge bg='warning'>Low Stock</Badge>
                  ) : null}
                </div>
              </td>
              <td>
                <Badge
                  bg={
                    p.quantity === 0
                      ? "danger"
                      : p.quantity < 5
                      ? "warning"
                      : "success"
                  }
                >
                  {p.quantity}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
