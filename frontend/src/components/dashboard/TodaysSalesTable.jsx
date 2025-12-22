import { useSales } from "../../context/useSales";
import { Card, Table, Pagination } from "react-bootstrap";
import { useState } from "react";

export default function TodaysSalesTable() {
  const { todaysSales, loading, todaysMessage, role } = useSales();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!role || loading) return <p>Loading today's sales...</p>;
  if (todaysMessage) return <p>{todaysMessage}</p>;
  if (!todaysSales || todaysSales.length === 0)
    return <p>No sales recorded yet.</p>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = todaysSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(todaysSales.length / itemsPerPage);

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
            <th>Total Price</th>
            <th>Date</th>
            {role === "admin" && <th>Sold By</th>}
          </tr>
        </thead>
        <tbody>
          {currentSales.map((s, i) => (
            <tr key={s._id}>
              <td>{indexOfFirstItem + i + 1}</td>
              <td>{s.product?.name || "Deleted"}</td>
              <td>{s.quantity || 0}</td>
              <td>₦{s.totalPrice?.toFixed(2) || 0}</td>
              <td>
                {s.createdAt ? new Date(s.createdAt).toLocaleString() : "N/A"}
              </td>
              {role === "admin" && <td>{s.soldBy?.name || "Unknown"}</td>}
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className='justify-content-center mt-3'>
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Card>
  );
}
