import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { Col, Form, Row, Button, Alert, Spinner } from "react-bootstrap";
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
      // Make login request
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true } // important for session cookies
      );

      const user = res.data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "storekeeper") {
        navigate("/store");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='loginField'>
      <Container className='container' fluid>
        <Row xs={1} md={2}>
          <Col className='justify-content-center align-content-center'>
            <div className='mb-4'>
              <h2 className='text-center'>
                Sign in to Manage Your Store with Ease
              </h2>
            </div>
            <div className='mb-3'>
              <h5 className='text-center'>
                Take full control of your store operations — anytime, anywhere
              </h5>
              <p className='text-center'>
                Whether you're a store owner or shop manager, our platform gives
                you powerful tools to monitor, manage, and grow your business
                effortlessly.
              </p>
            </div>
            <div className='text-center mt-5'>
              <a href='#'>Learn More</a>
            </div>
          </Col>

          <Col>
            <Card className='card mt-5'>
              <Card.Body>
                <Card.Title>
                  <h2 className='text-center mb-5'>Login</h2>
                </Card.Title>

                <Form onSubmit={handleLogin} className='w-50 mx-auto'>
                  {error && <Alert variant='danger'>{error}</Alert>}

                  <Form.Group className='mb-3'>
                    <Form.Label className='form-label'>Email</Form.Label>
                    <Form.Control
                      type='text'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label className='form-label'>Password</Form.Label>
                    <Form.Control
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    className='btn w-100'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size='sm' animation='border' /> Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
