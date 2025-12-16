import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "storekeeper",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError("");

    try {
      const payload = { ...formData, email: formData.email.toLowerCase() };

      await axios.post("http://localhost:5000/auth/register", payload, {
        withCredentials: true,
      });

      navigate("/");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) {
        const newFieldErrors = {};
        serverErrors.forEach((err) => {
          newFieldErrors[err.field] = err.message;
        });
        setFieldErrors(newFieldErrors);
      } else {
        setGeneralError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-page d-flex align-items-center'>
      <Container>
        <Row className='justify-content-center align-items-center'>
          {/* Left content */}
          <Col
            md={6}
            className='d-flex flex-column justify-content-center mb-4 mb-md-0'
          >
            <h1 className='fs-1 fw-bold text-center'>Create account</h1>
            <p className='lead text-dark text-center'>
              Register a new admin or storekeeper to manage inventory and sales
              efficiently.
            </p>
          </Col>

          {/* Right card */}
          <Col md={5}>
            <Card className='p-4 shadow-sm rounded-3'>
              <h3 className='text-center mb-4'>Register</h3>

              {generalError && <Alert variant='danger'>{generalError}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Name */}
                <Form.Group className='mb-3'>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={fieldErrors.name ? "is-invalid" : ""}
                    required
                  />
                  {fieldErrors.name && (
                    <div className='invalid-feedback'>{fieldErrors.name}</div>
                  )}
                </Form.Group>

                {/* Email */}
                <Form.Group className='mb-3'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? "is-invalid" : ""}
                    required
                  />
                  {fieldErrors.email && (
                    <div className='invalid-feedback'>{fieldErrors.email}</div>
                  )}
                </Form.Group>

                {/* Password */}
                <Form.Group className='mb-3'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className={fieldErrors.password ? "is-invalid" : ""}
                    required
                  />
                  {fieldErrors.password && (
                    <div className='invalid-feedback'>
                      {fieldErrors.password}
                    </div>
                  )}
                </Form.Group>

                {/* Role */}
                <Form.Group className='mb-4'>
                  <Form.Label>User Role</Form.Label>
                  <Form.Select
                    name='role'
                    value={formData.role}
                    onChange={handleChange}
                    className={fieldErrors.role ? "is-invalid" : ""}
                  >
                    <option value='admin'>Admin</option>
                    <option value='storekeeper'>Storekeeper</option>
                  </Form.Select>
                  {fieldErrors.role && (
                    <div className='invalid-feedback'>{fieldErrors.role}</div>
                  )}
                </Form.Group>

                <Button type='submit' className='w-100' disabled={loading}>
                  {loading ? (
                    <Spinner size='sm' animation='border' />
                  ) : (
                    "Register user"
                  )}
                </Button>
              </Form>

              <p className='text-center mt-3 mb-0 text-muted'>
                Already have an account? <a href='/'>Sign in</a>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
