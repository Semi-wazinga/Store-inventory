import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "storekeeper", // fixed role for this registration page
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await axios.post("http://localhost:5000/auth/register", formData);

      alert(`${formData.role} registered successfully!`);

      // Redirect based on role if you want:
      // navigate(`/${formData.role}/login`);
      navigate("/");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className='container d-flex justify-content-center align-items-center'
        style={{ minHeight: "100vh" }}
      >
        <div className='card p-4 shadow' style={{ width: "450px" }}>
          <h3 className='mb-3 text-center fw-bold'>Register User</h3>

          {errorMsg && <div className='alert alert-danger'>{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className='mb-3'>
              <label className='form-label'>Full Name</label>
              <input
                type='text'
                className='form-control'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className='mb-3'>
              <label className='form-label'>Email Address</label>
              <input
                type='email'
                className='form-control'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className='mb-3'>
              <label className='form-label'>Password</label>
              <input
                type='password'
                className='form-control'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className='mb-3'>
              <label className='form-label'>User Role</label>
              <select
                className='form-select'
                name='role'
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value='admin'>Admin</option>
                <option value='storekeeper'>Storekeeper</option>
              </select>
            </div>

            {/* Register Button */}
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
    </>
  );
};

export default RegisterPage;
