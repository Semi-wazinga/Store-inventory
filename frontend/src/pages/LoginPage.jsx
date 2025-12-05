import { useState } from "react";
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
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const user = res.data.user;

      // Wait a moment for cookie to be set, then navigate
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "storekeeper") navigate("/store");
        else setError("Unauthorized role");
      }, 300);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page d-flex align-items-center'>
      <Container>
        <Row className='justify-content-center'>
          {/* LEFT SIDE TEXT */}
          <Col md={6} className='d-flex flex-column justify-content-center'>
            <h1 className='fs-1 text-start'>Sign in</h1>
            <p className='lead text-start text-muted'>
              Access your dashboard and start managing your store efficiently.
            </p>
            <p className='text-start text-muted'>
              Whether you're an admin or storekeeper, the system gives you the
              tools to monitor inventory, track sales, and stay in control.
            </p>
            <a href='#' className='mt-4 text-start'>
              Learn more →
            </a>
          </Col>

          {/* RIGHT SIDE LOGIN FORM */}
          <Col md={5}>
            <Card className='p-4 shadow-sm'>
              <h3 className='text-center mb-4'>Login</h3>

              <Form onSubmit={handleLogin}>
                {error && <Alert variant='danger'>{error}</Alert>}

                <Form.Group className='mb-3'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter your email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter your password...'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button className='w-100' type='submit' disabled={loading}>
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
