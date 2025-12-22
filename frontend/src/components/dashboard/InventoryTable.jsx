import { useProducts } from "../../context/useProducts";
import { Card, Table, Badge, Pagination } from "react-bootstrap";
import { useState } from "react";
import "./InventoryTable.css";

export default function InventoryTable() {
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  if (loading) return <p>Loading inventory...</p>;
  if (!products.length) return <p>No products available.</p>;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatNumber = (num, decimals = 2) => {
    if (num == null || isNaN(num)) return "-";

    return Number.isInteger(num) ? num : Number(num.toFixed(decimals));
  };

  return (
    <Card className='p-4 shadow-sm mb-4 inventory-card'>
      <Card.Title className='text-center mb-4 fw-bold fs-4'>
        Current Inventory
      </Card.Title>

      <Table hover responsive className='align-middle mb-0 inventory-table'>
        <thead className='table-light'>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Packets / Bottles</th>
            <th>Total Cards</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p, i) => {
            const isPacket = p.stockType === "packet";

            const cards = isPacket
              ? p.stockCards ?? p.stockQuantity * p.cardsPerPacket
              : null;

            const units = isPacket ? cards / p.cardsPerPacket : p.stockQuantity;

            const isOut = isPacket ? cards <= 0 : units <= 0;
            const isLow = isPacket ? cards <= p.cardsPerPacket * 2 : units <= 5;

            return (
              <tr key={p._id}>
                <td>{indexOfFirstItem + i + 1}</td>

                <td className='d-flex align-items-center gap-2'>
                  <span className='fw-semibold'>{p.name}</span>
                  {isOut && <Badge bg='danger'>Out of Stock</Badge>}
                  {!isOut && isLow && <Badge bg='warning'>Low Stock</Badge>}
                </td>

                <td>
                  <Badge bg={isOut ? "danger" : isLow ? "warning" : "success"}>
                    {formatNumber(units, 2)}
                  </Badge>
                </td>

                <td>
                  {isPacket ? (
                    <Badge
                      bg={isOut ? "danger" : isLow ? "warning" : "success"}
                    >
                      {formatNumber(cards, 0)}
                    </Badge>
                  ) : (
                    <Badge bg='secondary'>-</Badge>
                  )}
                </td>

                <td>
                  {isOut ? (
                    <Badge bg='danger'>Out of Stock</Badge>
                  ) : isLow ? (
                    <Badge bg='warning'>Limited</Badge>
                  ) : (
                    <Badge bg='success'>In Stock</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className='justify-content-center mt-3'>
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Card>
  );
}
