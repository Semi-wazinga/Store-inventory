import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSales } from "../context/useSales";
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
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useSales();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      const payload = { ...formData, email: formData.email.toLowerCase() };
      await axios.post("http://localhost:5000/auth/login", payload, {
        withCredentials: true,
      });

      // Use loginSuccess from context to fetch user role immediately
      const userRole = await loginSuccess();

      // Redirect based on role
      if (userRole.toLowerCase() === "admin") navigate("/admin");
      else if (userRole.toLowerCase() === "storekeeper") navigate("/store");
      else setGeneralError("Unauthorized role");
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
            "Login failed. Please check your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='login-page d-flex align-items-center justify-content-center'
      style={{ minHeight: "100vh", background: "#0b63ce" }}
    >
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col
            md={6}
            className='d-flex flex-column justify-content-center mb-4 mb-md-0'
          >
            <h1 className='fs-1 fw-bold text-center'>Sign in</h1>
            <p className='lead text-dark text-bold text-center'>
              Access your dashboard and start managing your store efficiently.
            </p>
          </Col>

          <Col md={5}>
            <Card className='p-4 shadow rounded-3'>
              <h3 className='text-center mb-4'>Login</h3>

              <Form onSubmit={handleLogin}>
                {generalError && <Alert variant='danger'>{generalError}</Alert>}

                <Form.Group className='mb-3'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    placeholder='Enter your email...'
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? "is-invalid" : ""}
                    required
                  />
                  {fieldErrors.email && (
                    <div className='invalid-feedback'>{fieldErrors.email}</div>
                  )}
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    name='password'
                    placeholder='Enter your password...'
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

                <Button type='submit' className='w-100' disabled={loading}>
                  {loading ? (
                    <Spinner size='sm' animation='border' />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Form>

              <p className='text-center mt-3 mb-0 text-muted'>
                Don’t have an account? <a href='/register'>Register</a>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
