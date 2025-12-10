import { useProducts } from "../../context/useProducts";
import { Card, Table, Badge, Pagination } from "react-bootstrap";
import { useState } from "react";

export default function InventoryTable() {
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // show 5 products per page

  if (loading) return <p>Loading inventory...</p>;
  if (!products.length) return <p>No products available.</p>;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
          {currentProducts.map((p, i) => (
            <tr key={p._id}>
              <td>{indexOfFirstItem + i + 1}</td>
              <td className='d-flex align-items-center gap-2'>
                <span className='fw-semibold'>{p.name}</span>
                {p.quantity === 0 ? (
                  <Badge bg='danger'>Out of Stock</Badge>
                ) : p.quantity < 5 ? (
                  <Badge bg='warning'>Low Stock</Badge>
                ) : null}
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
