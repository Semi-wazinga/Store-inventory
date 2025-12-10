import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "storekeeper", // match backend
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

      const res = await axios.post(
        "http://localhost:5000/auth/register",
        payload,
        { withCredentials: true }
      );

      alert(`${res.data.user.role} registered successfully!`);
      navigate("/"); // or navigate to login page
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
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ minHeight: "100vh" }}
    >
      <div className='card p-4 shadow' style={{ width: "450px" }}>
        <h3 className='mb-3 text-center fw-bold'>Register User</h3>

        {generalError && (
          <div
            className='alert alert-danger'
            style={{ whiteSpace: "pre-line" }}
          >
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className='mb-3'>
            <label className='form-label'>Full Name</label>
            <input
              type='text'
              className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && (
              <div className='invalid-feedback'>{fieldErrors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className='mb-3'>
            <label className='form-label'>Email Address</label>
            <input
              type='email'
              className={`form-control ${
                fieldErrors.email ? "is-invalid" : ""
              }`}
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <div className='invalid-feedback'>{fieldErrors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className='mb-3'>
            <label className='form-label'>Password</label>
            <input
              type='password'
              className={`form-control ${
                fieldErrors.password ? "is-invalid" : ""
              }`}
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && (
              <div className='invalid-feedback'>{fieldErrors.password}</div>
            )}
          </div>

          {/* Role */}
          <div className='mb-3'>
            <label className='form-label'>User Role</label>
            <select
              className={`form-select ${fieldErrors.role ? "is-invalid" : ""}`}
              name='role'
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value='admin'>Admin</option>
              <option value='storekeeper'>Storekeeper</option>
            </select>
            {fieldErrors.role && (
              <div className='invalid-feedback'>{fieldErrors.role}</div>
            )}
          </div>

          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={loading}
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
