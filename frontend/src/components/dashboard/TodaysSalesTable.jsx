import { useSales } from "../../context/useSales";
import { Card, Table, Badge } from "react-bootstrap";

export default function TodaysSalesTable() {
  const { todaysSales, loading, todaysMessage, role } = useSales();

  if (!role || loading) return <p>Loading today's sales...</p>;
  if (todaysMessage) return <p>{todaysMessage}</p>;
  if (!todaysSales || todaysSales.length === 0)
    return <p>No sales recorded yet.</p>;

  return (
    <Card className='p-4 shadow-sm mb-4'>
      <Card.Title className='text-center mb-4 fw-bold fs-4'>
        Today's Sales
      </Card.Title>
      <Table hover responsive className='align-middle mb-0'>
        <thead className='table-light'>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty Sold</th>
            <th>Date</th>
            {role === "admin" && <th>Sold By</th>}
          </tr>
        </thead>
        <tbody>
          {todaysSales.map((s, i) => (
            <tr key={s._id}>
              <td>{i + 1}</td>
              <td>{s.product?.name || "Product Deleted"}</td>
              <td>
                <Badge bg='primary'>{s.quantity}</Badge>
              </td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              {role === "admin" && <td>{s.soldBy?.name || "Unknown"}</td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
