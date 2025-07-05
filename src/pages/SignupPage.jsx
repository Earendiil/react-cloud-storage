import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import api from '../api/apiCLient';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors(prev => ({ ...prev, [e.target.name]: '' })); 
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setFormErrors({});

  try {
    await api.post("/create", formData); 
    toast.success("Account created! You can now log in.");
    navigate("/");
  } catch (err) {
    if (err.response?.data?.errors) {
      setFormErrors(err.response.data.errors);
    } else if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Registration failed.");
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
